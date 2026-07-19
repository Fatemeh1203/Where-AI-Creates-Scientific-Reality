import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";
import { ServiceCard } from "@/components/ServiceCard";
import { CtaBanner } from "@/components/CtaBanner";

export function ServicesBody({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const { services } = content;

  return (
    <PageShell locale={locale} content={content}>
      <section className="pb-16 pt-20 sm:pt-28">
        <div className="container-page text-center">
          <p className="eyebrow mb-3">{services.eyebrow}</p>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">{services.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">{services.subtitle}</p>
        </div>
      </section>

      <section className="pb-12">
        <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page">
          <p className="mx-auto max-w-2xl text-center text-xs text-slate-500">{services.processNote}</p>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <CtaBanner locale={locale} title={services.ctaTitle} subtitle={services.ctaSubtitle} button={services.ctaButton} />
      </section>
    </PageShell>
  );
}
