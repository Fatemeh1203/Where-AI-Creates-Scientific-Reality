import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendNotificationEmail, escapeHtml } from "@/lib/email";
import { orderSchema } from "@/lib/validation";
import { requestZarinpalPayment } from "@/lib/zarinpal";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { fullName, email, phone, serviceType, budgetRange, timeline, description, locale, wantsDeposit, depositAmount } =
    parsed.data;

  const supabase = getSupabaseAdmin();

  try {
    const { data: order, error: dbError } = await supabase
      .from("orders")
      .insert({
        full_name: fullName,
        email,
        phone: phone || null,
        service_type: serviceType,
        budget_range: budgetRange || null,
        timeline: timeline || null,
        description,
        locale,
        deposit_amount: wantsDeposit ? depositAmount ?? null : null,
        payment_status: wantsDeposit ? "awaiting_payment" : "not_required",
      })
      .select("id")
      .single();

    if (dbError || !order) {
      console.error("Supabase insert error (orders):", dbError);
      return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
    }

    await sendNotificationEmail({
      subject: `New project request — ${serviceType}`,
      replyTo: email,
      html: `
        <h2>New project / quote request</h2>
        <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p><strong>Service:</strong> ${escapeHtml(serviceType)}</p>
        ${budgetRange ? `<p><strong>Budget:</strong> ${escapeHtml(budgetRange)}</p>` : ""}
        ${timeline ? `<p><strong>Timeline:</strong> ${escapeHtml(timeline)}</p>` : ""}
        <p><strong>Language:</strong> ${locale}</p>
        <p><strong>Description:</strong></p>
        <p>${escapeHtml(description).replace(/\n/g, "<br/>")}</p>
        <p><strong>Deposit requested:</strong> ${wantsDeposit ? `Yes (${depositAmount} Toman)` : "No"}</p>
        <p><em>Order ID: ${order.id}</em></p>
      `,
    });

    if (wantsDeposit && depositAmount) {
      const origin = request.nextUrl.origin;
      try {
        const { authority, paymentUrl } = await requestZarinpalPayment({
          amount: depositAmount,
          description: `Deposit for order ${order.id} — ${serviceType}`,
          callbackUrl: `${origin}/api/payment/zarinpal/callback?orderId=${order.id}`,
          email,
          mobile: phone || undefined,
        });

        await supabase.from("orders").update({ payment_authority: authority }).eq("id", order.id);

        return NextResponse.json({ success: true, orderId: order.id, paymentUrl });
      } catch (payErr) {
        console.error("ZarinPal request error:", payErr);
        await supabase.from("orders").update({ payment_status: "failed" }).eq("id", order.id);
        return NextResponse.json(
          { success: true, orderId: order.id, paymentUrl: null, paymentError: true },
          { status: 200 }
        );
      }
    }

    return NextResponse.json({ success: true, orderId: order.id, paymentUrl: null });
  } catch (err) {
    console.error("Orders route error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
