import crypto from "node:crypto";

/**
 * Server-side password gate for the private lab (fiber-optic current-sensor
 * simulator). The simulator HTML is never publicly reachable — it is only
 * served after this password is verified on the server and a signed cookie
 * is set, so knowing the URL is not enough.
 *
 * Configure via env:
 *   LAB_PASSWORD        — the access password (default "project01")
 *   LAB_COOKIE_SECRET   — secret used to sign the auth cookie
 */

export const LAB_COOKIE_NAME = "lab_auth";

function getPassword() {
  return process.env.LAB_PASSWORD || "project01";
}

function getSecret() {
  return process.env.LAB_COOKIE_SECRET || "simorgh-lab-default-secret-please-change";
}

/** The signed token that a valid auth cookie must contain. */
export function expectedToken() {
  return crypto.createHmac("sha256", getSecret()).update("lab-access-v1").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** True if the submitted password matches the configured lab password. */
export function passwordMatches(submitted: string) {
  const expected = getPassword();
  // Pad to equal length for a timing-safe compare without leaking length.
  const a = crypto.createHash("sha256").update(submitted).digest("hex");
  const b = crypto.createHash("sha256").update(expected).digest("hex");
  return safeEqual(a, b);
}

/** True if a cookie value is a valid, unforged auth token. */
export function cookieIsValid(value: string | undefined) {
  if (!value) return false;
  return safeEqual(value, expectedToken());
}
