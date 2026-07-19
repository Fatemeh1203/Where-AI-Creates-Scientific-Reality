"use client";

import { useState, type FormEvent } from "react";
import type { ContactContent, Locale } from "@/content/schema";

export function ContactForm({ locale, content }: { locale: Locale; content: ContactContent }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          subject: data.get("subject"),
          message: data.get("message"),
          locale,
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-5 p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label-field" htmlFor="name">{content.formName}</label>
          <input id="name" name="name" required minLength={2} className="input-field" />
        </div>
        <div>
          <label className="label-field" htmlFor="email">{content.formEmail}</label>
          <input id="email" name="email" type="email" required className="input-field" />
        </div>
      </div>

      <div>
        <label className="label-field" htmlFor="subject">{content.formSubject}</label>
        <input id="subject" name="subject" className="input-field" />
      </div>

      <div>
        <label className="label-field" htmlFor="message">{content.formMessage}</label>
        <textarea id="message" name="message" required minLength={5} rows={5} className="input-field resize-none" />
      </div>

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full disabled:opacity-60">
        {status === "submitting" ? content.formSubmitting : content.formSubmit}
      </button>

      {status === "success" && <p className="text-center text-sm text-firoozeh-400">{content.formSuccess}</p>}
      {status === "error" && <p className="text-center text-sm text-anar-400">{content.formError}</p>}
    </form>
  );
}
