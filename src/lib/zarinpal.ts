/**
 * Minimal ZarinPal Payment Gateway client (REST API v4).
 *
 * Defaults to ZarinPal's public sandbox merchant ID so the checkout flow
 * is fully testable out of the box. To accept real payments, set
 * ZARINPAL_MERCHANT_ID (your real merchant ID from zarinpal.com) and
 * ZARINPAL_SANDBOX=false in the environment.
 */

const SANDBOX_MERCHANT_ID = "00000000-0000-0000-0000-000000000000";

function isSandbox() {
  return process.env.ZARINPAL_SANDBOX !== "false";
}

function getMerchantId() {
  return process.env.ZARINPAL_MERCHANT_ID || SANDBOX_MERCHANT_ID;
}

function getApiBase() {
  return isSandbox() ? "https://sandbox.zarinpal.com" : "https://api.zarinpal.com";
}

export function getStartPayUrl(authority: string) {
  const host = isSandbox() ? "https://sandbox.zarinpal.com" : "https://www.zarinpal.com";
  return `${host}/pg/StartPay/${authority}`;
}

interface RequestPaymentParams {
  amount: number;
  description: string;
  callbackUrl: string;
  email?: string;
  mobile?: string;
}

interface ZarinpalRequestResponse {
  data: { code: number; message: string; authority: string };
  errors: unknown[];
}

interface ZarinpalVerifyResponse {
  data: { code: number; message: string; ref_id?: number; card_pan?: string };
  errors: unknown[];
}

export async function requestZarinpalPayment({
  amount,
  description,
  callbackUrl,
  email,
  mobile,
}: RequestPaymentParams) {
  const response = await fetch(`${getApiBase()}/pg/v4/payment/request.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: getMerchantId(),
      amount,
      description,
      callback_url: callbackUrl,
      metadata: { email, mobile },
    }),
  });

  const json = (await response.json()) as ZarinpalRequestResponse;

  if (json.data?.code !== 100) {
    throw new Error(`ZarinPal request failed: ${json.data?.message || "unknown error"}`);
  }

  return {
    authority: json.data.authority,
    paymentUrl: getStartPayUrl(json.data.authority),
  };
}

export async function verifyZarinpalPayment({ amount, authority }: { amount: number; authority: string }) {
  const response = await fetch(`${getApiBase()}/pg/v4/payment/verify.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: getMerchantId(),
      amount,
      authority,
    }),
  });

  const json = (await response.json()) as ZarinpalVerifyResponse;

  const success = json.data?.code === 100 || json.data?.code === 101;

  return {
    success,
    refId: json.data?.ref_id,
    message: json.data?.message,
  };
}
