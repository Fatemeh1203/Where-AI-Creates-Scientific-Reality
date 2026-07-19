import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyZarinpalPayment } from "@/lib/zarinpal";
import { sendNotificationEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const orderId = searchParams.get("orderId");
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");

  const supabase = getSupabaseAdmin();

  if (!orderId || !authority) {
    return NextResponse.redirect(`${origin}/order/result?status=error`);
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, locale, deposit_amount, payment_status")
    .eq("id", orderId)
    .single();

  const locale = order?.locale === "fa" ? "fa" : "en";
  const localePrefix = locale === "fa" ? "/fa" : "";

  if (!order) {
    return NextResponse.redirect(`${origin}${localePrefix}/order/result?status=error`);
  }

  if (status !== "OK") {
    await supabase.from("orders").update({ payment_status: "failed" }).eq("id", orderId);
    return NextResponse.redirect(`${origin}${localePrefix}/order/result?status=cancelled`);
  }

  try {
    const verification = await verifyZarinpalPayment({
      amount: Number(order.deposit_amount) || 0,
      authority,
    });

    if (verification.success) {
      await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          payment_ref_id: verification.refId ? String(verification.refId) : null,
        })
        .eq("id", orderId);

      await sendNotificationEmail({
        subject: `Deposit received for order ${orderId}`,
        html: `<p>A deposit payment was successfully verified for order <strong>${orderId}</strong>.</p><p>Reference ID: ${verification.refId ?? "N/A"}</p>`,
      });

      return NextResponse.redirect(`${origin}${localePrefix}/order/result?status=success&ref=${verification.refId ?? ""}`);
    }

    await supabase.from("orders").update({ payment_status: "failed" }).eq("id", orderId);
    return NextResponse.redirect(`${origin}${localePrefix}/order/result?status=error`);
  } catch (err) {
    console.error("ZarinPal verify error:", err);
    await supabase.from("orders").update({ payment_status: "failed" }).eq("id", orderId);
    return NextResponse.redirect(`${origin}${localePrefix}/order/result?status=error`);
  }
}
