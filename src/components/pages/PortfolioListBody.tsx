import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";
import { ProjectCard } from "@/components/ProjectCard";
import { CtaBanner } from "@/components/CtaBanner";

export function PortfolioListBody({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const { portfolio, home } = content;

  return (
    <PageShell locale={locale} content={content}>
      <section className="pb-16 pt-20 sm:pt-28">
        <div className="container-page text-center">
          <p className="eyebrow mb-3">{portfolio.eyebrow}</p>
          <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">{portfolio.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-400">{portfolio.subtitle}</p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.projects.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} viewLabel={portfolio.viewCase} />
          ))}
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <CtaBanner locale={locale} title={home.ctaBannerTitle} subtitle={home.ctaBannerSubtitle} button={home.ctaBannerButton} />
      </section>
    </PageShell>
  );
}
