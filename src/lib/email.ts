import { Resend } from "resend";

const FROM_ADDRESS = process.env.NOTIFICATIONS_FROM_EMAIL || "Simorgh AI Labs <onboarding@resend.dev>";
const TO_ADDRESS = process.env.NOTIFICATIONS_TO_EMAIL || "f.shams.apg@gmail.com";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

interface NotifyParams {
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Sends a notification email. If RESEND_API_KEY is not configured, this
 * silently no-ops (the submission is still saved to Supabase) so local
 * development and pre-launch deployments don't crash on missing config.
 */
export async function sendNotificationEmail({ subject, html, replyTo }: NotifyParams) {
  const client = getResendClient();
  if (!client) {
    console.warn("RESEND_API_KEY not set — skipping email notification:", subject);
    return { skipped: true };
  }

  const result = await client.emails.send({
    from: FROM_ADDRESS,
    to: TO_ADDRESS,
    subject,
    html,
    replyTo,
  });

  return result;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
