"use client";

import { useState, type FormEvent } from "react";
import type { Locale, OrderContent } from "@/content/schema";

export function OrderForm({ locale, content }: { locale: Locale; content: OrderContent }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [wantsDeposit, setWantsDeposit] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);
    const depositAmountRaw = data.get("depositAmount");
    const depositAmount = wantsDeposit && depositAmountRaw ? Number(depositAmountRaw) : undefined;

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.get("fullName"),
          email: data.get("email"),
          phone: data.get("phone"),
          serviceType: data.get("serviceType"),
          budgetRange: data.get("budgetRange"),
          timeline: data.get("timeline"),
          description: data.get("description"),
          locale,
          wantsDeposit,
          depositAmount,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const json = await res.json();

      if (json.paymentUrl) {
        window.location.href = json.paymentUrl;
        return;
      }

      setStatus("success");
      form.reset();
      setWantsDeposit(false);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-firoozeh-500/15 text-2xl text-firoozeh-400">
          ✓
        </div>
        <h3 className="font-heading text-xl font-semibold text-white">{content.formSuccessTitle}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">{content.formSuccessBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-5 p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="fullName">{content.formName}</label>
          <input id="fullName" name="fullName" required minLength={2} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="email">{content.formEmail}</label>
          <input id="email" name="email" type="email" required className="input-field" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="phone">{content.formPhone}</label>
          <input id="phone" name="phone" className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="serviceType">{content.formServiceType}</label>
          <select id="serviceType" name="serviceType" required className="input-field">
            {content.serviceOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-night-900">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="budgetRange">{content.formBudget}</label>
          <select id="budgetRange" name="budgetRange" className="input-field">
            {content.budgetOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-night-900">
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-field" htmlFor="timeline">{content.formTimeline}</label>
          <select id="timeline" name="timeline" className="input-field">
            {content.timelineOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-night-900">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="description">{content.formDescription}</label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          rows={5}
          placeholder={content.formDescriptionPlaceholder}
          className="input-field resize-none"
        />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <label className="flex items-start gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={wantsDeposit}
            onChange={(e) => setWantsDeposit(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-firoozeh-500"
          />
          <span>{content.depositNote}</span>
        </label>

        {wantsDeposit && (
          <div className="mt-4">
            <label className="label-field" htmlFor="depositAmount">
              {locale === "fa" ? "مبلغ بیعانه (تومان)" : "Deposit amount (Toman)"}
            </label>
            <input
              id="depositAmount"
              name="depositAmount"
              type="number"
              min={10000}
              step={1000}
              defaultValue={500000}
              className="input-field"
            />
          </div>
        )}
      </div>

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full disabled:opacity-60">
        {status === "submitting" ? content.formSubmitting : wantsDeposit ? content.payNow : content.formSubmit}
      </button>

      {status === "error" && <p className="text-center text-sm text-anar-400">{content.formError}</p>}
    </form>
  );
}
