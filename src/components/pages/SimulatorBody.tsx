import Link from "next/link";
import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";
import { FbgSimulator } from "@/components/FbgSimulator";
import { localeHref } from "@/lib/paths";

const copy = {
  en: {
    eyebrow: "Live Demo",
    title: "Fiber Bragg Grating Sensor Simulator",
    subtitle:
      "An interactive, physics-based model of an FBG optical sensor. Adjust temperature and strain and watch the reflected Bragg peak shift in real time — the same forward model my calibration and denoising work is built on.",
    labEyebrow: "Private Lab",
    labTitle: "Fiber-Optic Current Sensor Simulator",
    labBody: "An advanced multi-phase simulation of a fiber-optic current sensor (Faraday effect). Password-protected — enter the access code you were given.",
    labButton: "Open private simulator",
    ctaTitle: "Want a custom simulator or sensor model like this?",
    ctaSubtitle: "This kind of interactive tool can be built around your own sensor, experiment, or dataset.",
    ctaButton: "Request a Quote",
    aboutTitle: "What you're looking at",
    aboutBody: [
      "A Fiber Bragg Grating reflects one specific wavelength of light — the Bragg wavelength — determined by the grating period and the fibre's refractive index. Both change with temperature and mechanical strain, so the reflected peak shifts, and measuring that shift turns the fibre into a precise sensor.",
      "The curve above is the grating's reflection spectrum. The dashed grey peak is the reference at 25 °C with no strain; the glowing peak is the live response. Toggle measurement noise to see the noisy signal a machine-learning stage would clean up before extracting the true wavelength.",
    ],
  },
  fa: {
    eyebrow: "نمونه‌ی زنده",
    title: "شبیه‌ساز حسگر توری براگ فیبری",
    subtitle:
      "یک مدل تعاملی و مبتنی بر فیزیک از حسگر نوری FBG. دما و کرنش را تغییر دهید و جابه‌جایی زنده‌ی قله‌ی براگ را ببینید — همان مدل مستقیمی که کار کالیبراسیون و حذف نویز من روی آن ساخته شده است.",
    labEyebrow: "آزمایشگاه خصوصی",
    labTitle: "شبیه‌ساز حسگر جریان فیبر نوری",
    labBody: "یک شبیه‌سازی پیشرفته و چندفازی از حسگر جریان فیبر نوری (اثر فارادی). محافظت‌شده با رمز — کد دسترسی‌ای را که به شما داده شده وارد کنید.",
    labButton: "باز کردن شبیه‌ساز خصوصی",
    ctaTitle: "شبیه‌ساز یا مدل حسگر اختصاصی مثل این می‌خواهید؟",
    ctaSubtitle: "این نوع ابزار تعاملی می‌تواند حول حسگر، آزمایش یا مجموعه‌داده‌ی خودتان ساخته شود.",
    ctaButton: "درخواست قیمت",
    aboutTitle: "چه چیزی می‌بینید",
    aboutBody: [
      "توری براگ فیبری یک طول‌موج مشخص از نور — طول‌موج براگ — را بازتاب می‌دهد که توسط دوره‌ی توری و ضریب شکست فیبر تعیین می‌شود. هر دو با دما و کرنش مکانیکی تغییر می‌کنند، پس قله‌ی بازتابی جابه‌جا می‌شود؛ اندازه‌گیری این جابه‌جایی، فیبر را به یک حسگر دقیق تبدیل می‌کند.",
      "منحنی بالا طیف بازتاب توری است. قله‌ی خاکستری‌رنگِ خط‌چین، مرجع در دمای ۲۵ درجه و بدون کرنش است؛ قله‌ی درخشان، پاسخ زنده است. نویز اندازه‌گیری را فعال کنید تا سیگنال نویزی‌ای را ببینید که یک مرحله‌ی یادگیری ماشین پیش از استخراج طول‌موج واقعی، آن را پاک‌سازی می‌کند.",
    ],
  },
};

export function SimulatorBody({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const c = copy[locale];

  return (
    <PageShell locale={locale} content={content}>
      <section className="pb-12 pt-20 sm:pt-28">
        <div className="container-page text-center">
          <p className="eyebrow mb-3">{c.eyebrow}</p>
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">{c.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">{c.subtitle}</p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page max-w-4xl">
          <FbgSimulator locale={locale} />
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page max-w-3xl">
          <h2 className="font-heading text-xl font-bold text-white">{c.aboutTitle}</h2>
          <div className="mt-4 space-y-4">
            {c.aboutBody.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-slate-400 sm:text-base">{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page max-w-4xl">
          <div className="glass-card flex flex-col items-start gap-4 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-firoozeh-500/15 text-xl text-firoozeh-400">
                🔒
              </span>
              <div>
                <p className="eyebrow !text-[11px]">{c.labEyebrow}</p>
                <h3 className="mt-1 font-heading text-lg font-semibold text-white">{c.labTitle}</h3>
                <p className="mt-1 max-w-xl text-sm text-slate-400">{c.labBody}</p>
              </div>
            </div>
            <Link href={localeHref(locale, "/lab")} className="btn-secondary shrink-0 whitespace-nowrap">
              {c.labButton}
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="container-page">
          <div className="glass-card flex flex-col items-center gap-4 p-8 text-center sm:p-12">
            <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">{c.ctaTitle}</h2>
            <p className="max-w-xl text-sm text-slate-400">{c.ctaSubtitle}</p>
            <Link href={localeHref(locale, "/order")} className="btn-primary mt-2">
              {c.ctaButton}
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
