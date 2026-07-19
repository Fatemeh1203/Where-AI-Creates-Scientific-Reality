import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendNotificationEmail, escapeHtml } from "@/lib/email";
import { contactSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input.", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, subject, message, locale } = parsed.data;

  try {
    const supabase = getSupabaseAdmin();
    const { error: dbError } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject: subject || null,
      message,
      locale,
    });

    if (dbError) {
      console.error("Supabase insert error (contact_messages):", dbError);
      return NextResponse.json({ error: "Could not save your message. Please try again." }, { status: 500 });
    }

    await sendNotificationEmail({
      subject: `New contact message from ${name}`,
      replyTo: email,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ""}
        <p><strong>Language:</strong> ${locale}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
