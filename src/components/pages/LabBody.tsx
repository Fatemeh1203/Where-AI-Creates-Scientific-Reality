import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";
import { LabGate } from "@/components/LabGate";

const copy = {
  en: {
    eyebrow: "Private Lab",
    title: "Fiber-Optic Current Sensor Simulator",
    subtitle:
      "An advanced, multi-phase interactive simulation of a fiber-optic current sensor (Faraday effect). Access is password-protected.",
    openNewTab: "Open in a new tab",
    lockedNote: "You're viewing this in restricted mode.",
  },
  fa: {
    eyebrow: "آزمایشگاه خصوصی",
    title: "شبیه‌ساز حسگر جریان فیبر نوری",
    subtitle:
      "یک شبیه‌سازی تعاملی پیشرفته و چندفازی از حسگر جریان فیبر نوری (اثر فارادی). دسترسی با رمز محافظت شده است.",
    openNewTab: "باز کردن در تب جدید",
    lockedNote: "شما در حالت محدود در حال مشاهده هستید.",
  },
};

export function LabBody({ locale, authed }: { locale: Locale; authed: boolean }) {
  const content = getContent(locale);
  const c = copy[locale];

  return (
    <PageShell locale={locale} content={content}>
      <section className="pb-10 pt-20 sm:pt-28">
        <div className="container-page text-center">
          <p className="eyebrow mb-3">{c.eyebrow}</p>
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">{c.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">{c.subtitle}</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          {authed ? (
            <div>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-night-900">
                <iframe
                  src="/lab/frame"
                  title={c.title}
                  className="h-[82vh] min-h-[560px] w-full"
                  // The simulator is our own first-party content.
                  sandbox="allow-scripts allow-same-origin allow-downloads allow-popups"
                />
              </div>
              <div className="mt-4 text-center">
                <a
                  href="/lab/frame"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-firoozeh-400 hover:text-firoozeh-300"
                >
                  {c.openNewTab} ↗
                </a>
              </div>
            </div>
          ) : (
            <LabGate locale={locale} />
          )}
        </div>
      </section>
    </PageShell>
  );
}
