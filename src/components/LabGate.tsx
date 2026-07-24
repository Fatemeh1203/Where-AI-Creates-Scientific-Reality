"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Locale } from "@/content/schema";

const dict = {
  en: {
    label: "Access password",
    placeholder: "Enter password",
    submit: "Unlock simulator",
    submitting: "Checking…",
    error: "Wrong password. Please try again.",
    hint: "This simulator is private. Enter the password you were given to view it.",
  },
  fa: {
    label: "رمز دسترسی",
    placeholder: "رمز را وارد کنید",
    submit: "باز کردن شبیه‌ساز",
    submitting: "در حال بررسی…",
    error: "رمز اشتباه است. لطفاً دوباره تلاش کنید.",
    hint: "این شبیه‌ساز خصوصی است. رمزی را که به شما داده شده وارد کنید تا آن را ببینید.",
  },
};

export function LabGate({ locale }: { locale: Locale }) {
  const t = dict[locale];
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const password = new FormData(e.currentTarget).get("password");

    try {
      const res = await fetch("/api/lab/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card mx-auto max-w-md p-8">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-firoozeh-500/15 text-2xl text-firoozeh-400">
        🔒
      </div>
      <p className="mb-6 text-center text-sm leading-relaxed text-slate-400">{t.hint}</p>

      <label htmlFor="lab-password" className="label-field">{t.label}</label>
      <input
        id="lab-password"
        name="password"
        type="password"
        required
        autoFocus
        placeholder={t.placeholder}
        className="input-field"
      />

      <button type="submit" disabled={status === "submitting"} className="btn-primary mt-5 w-full disabled:opacity-60">
        {status === "submitting" ? t.submitting : t.submit}
      </button>

      {status === "error" && <p className="mt-3 text-center text-sm text-anar-400">{t.error}</p>}
    </form>
  );
}
