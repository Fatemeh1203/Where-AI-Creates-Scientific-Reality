import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";

export function LegalBody({ locale, page }: { locale: Locale; page: "privacy" | "terms" }) {
  const content = getContent(locale);
  const { legal } = content;
  const title = page === "privacy" ? legal.privacyTitle : legal.termsTitle;
  const body = page === "privacy" ? legal.privacyBody : legal.termsBody;

  return (
    <PageShell locale={locale} content={content}>
      <section className="pb-24 pt-20 sm:pt-28">
        <div className="container-page max-w-3xl">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          <div className="mt-8 space-y-5">
            {body.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-slate-400 sm:text-base">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
