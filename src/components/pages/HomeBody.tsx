import Link from "next/link";
import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";
import { Hero } from "@/components/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { FeatureGrid } from "@/components/FeatureGrid";
import { ProjectCard } from "@/components/ProjectCard";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CtaBanner } from "@/components/CtaBanner";
import { ResumeTeaser } from "@/components/ResumeTeaser";
import { Reveal } from "@/components/Reveal";
import { localeHref } from "@/lib/paths";

const resumeLabel = {
  en: { eyebrow: "Résumé", title: "Physicist & AI engineer for hire" },
  fa: { eyebrow: "رزومه", title: "فیزیک‌دان و مهندس هوش مصنوعی، آماده‌ی همکاری" },
};

export function HomeBody({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const { home, portfolio, nav } = content;
  const featured = portfolio.projects.slice(0, 3);
  const rl = resumeLabel[locale];

  return (
    <PageShell locale={locale} content={content}>
      <Hero locale={locale} hero={home.hero} />

      <section className="section-padding">
        <div className="container-page">
          <SectionHeading eyebrow={home.introEyebrow} title={home.introTitle} subtitle={home.introBody} />
        </div>
      </section>

      <section className="pb-20 sm:pb-28">
        <div className="container-page">
          <FeatureGrid features={home.features} />
        </div>
      </section>

      <section className="section-padding bg-night-900/40">
        <div className="container-page">
          <SectionHeading eyebrow={rl.eyebrow} title={rl.title} />
          <div className="mt-12">
            <ResumeTeaser locale={locale} content={content} />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-start">
              <p className="eyebrow mb-2">{home.portfolioTeaserTitle}</p>
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{portfolio.title}</h2>
              <p className="mt-2 max-w-md text-sm text-slate-400">{home.portfolioTeaserSubtitle}</p>
            </div>
            <Link href={localeHref(locale, "/portfolio")} className="btn-secondary shrink-0">
              {nav.portfolio}
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <Reveal key={project.slug} index={i} className="h-full">
                <ProjectCard project={project} locale={locale} viewLabel={portfolio.viewCase} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <SectionHeading eyebrow={content.services.eyebrow} title={home.processTitle} subtitle={home.processSubtitle} />
          <div className="mt-12">
            <ProcessSteps steps={home.processSteps} />
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <CtaBanner locale={locale} title={home.ctaBannerTitle} subtitle={home.ctaBannerSubtitle} button={home.ctaBannerButton} />
      </section>
    </PageShell>
  );
}
