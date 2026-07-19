import Link from "next/link";
import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";
import { localeHref } from "@/lib/paths";

type Status = "success" | "cancelled" | "error";

const COPY: Record<Locale, Record<Status, { title: string; body: string }>> = {
  en: {
    success: {
      title: "Payment received — thank you!",
      body: "Your deposit was verified successfully. I'll follow up by email shortly to confirm next steps for your project.",
    },
    cancelled: {
      title: "Payment cancelled",
      body: "The payment was cancelled before completion. Your project request has still been saved — you can pay the deposit later, or wait for my email reply.",
    },
    error: {
      title: "Payment could not be verified",
      body: "Something went wrong verifying this payment. If an amount was deducted, it will be refunded automatically by the gateway — please also reach out by email so I can confirm your project request.",
    },
  },
  fa: {
    success: {
      title: "پرداخت با موفقیت انجام شد — سپاسگزارم!",
      body: "بیعانه‌ی شما با موفقیت تأیید شد. به‌زودی از طریق ایمیل برای هماهنگی گام‌های بعدی پروژه با شما تماس می‌گیرم.",
    },
    cancelled: {
      title: "پرداخت لغو شد",
      body: "پرداخت پیش از تکمیل لغو شد. درخواست پروژه‌ی شما همچنان ذخیره شده است — می‌توانید بعداً بیعانه را پرداخت کنید یا منتظر پاسخ ایمیل بمانید.",
    },
    error: {
      title: "پرداخت تأیید نشد",
      body: "مشکلی در تأیید این پرداخت پیش آمد. در صورت کسر مبلغ، توسط درگاه به‌طور خودکار بازگردانده می‌شود — لطفاً از طریق ایمیل نیز با من در تماس باشید تا درخواست پروژه‌ی شما را تأیید کنم.",
    },
  },
};

export function OrderResultBody({ locale, status }: { locale: Locale; status: string | undefined }) {
  const content = getContent(locale);
  const resolvedStatus: Status = status === "success" || status === "cancelled" ? status : "error";
  const copy = COPY[locale][resolvedStatus];

  return (
    <PageShell locale={locale} content={content}>
      <section className="flex min-h-[60vh] items-center pb-24 pt-28">
        <div className="container-page">
          <div className="glass-card mx-auto max-w-lg p-10 text-center">
            <div
              className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl ${
                resolvedStatus === "success" ? "bg-firoozeh-500/15 text-firoozeh-400" : "bg-anar-500/15 text-anar-400"
              }`}
            >
              {resolvedStatus === "success" ? "✓" : "!"}
            </div>
            <h1 className="font-heading text-2xl font-bold text-white">{copy.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{copy.body}</p>
            <Link href={localeHref(locale, "/")} className="btn-primary mt-8 inline-flex">
              {content.common.notFoundCta}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
