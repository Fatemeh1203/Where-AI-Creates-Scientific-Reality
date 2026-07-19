import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";
import { CtaBanner } from "@/components/CtaBanner";
import { Icon } from "@/components/Icons";
import { localeHref } from "@/lib/paths";

export function PortfolioDetailBody({ locale, slug }: { locale: Locale; slug: string }) {
  const content = getContent(locale);
  const { portfolio, home } = content;
  const project = portfolio.projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <PageShell locale={locale} content={content}>
      <section className="pb-16 pt-20 sm:pt-28">
        <div className="container-page">
          <Link href={localeHref(locale, "/portfolio")} className="inline-flex items-center gap-1.5 text-sm text-firoozeh-400 hover:text-firoozeh-300">
            <span className="rtl:rotate-180">←</span>
            {portfolio.backToPortfolio}
          </Link>

          <div className="mt-8 flex flex-col items-start gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-firoozeh-500/20 to-banafsh-500/10 text-firoozeh-400">
              <Icon name={project.icon} className="h-7 w-7" />
            </span>
            <p className="eyebrow">{project.category}</p>
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">{project.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span>{project.role}</span>
              <span aria-hidden>·</span>
              <span>{project.year}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="badge">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5">
            {project.description.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-slate-300 sm:text-base">
                {p}
              </p>
            ))}
          </div>

          <div className="glass-card h-fit p-6">
            <h3 className="font-heading text-base font-semibold text-white">
              {locale === "fa" ? "نتایج کلیدی" : "Key Results"}
            </h3>
            <ul className="mt-4 space-y-3">
              {project.results.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-firoozeh-400" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <CtaBanner locale={locale} title={home.ctaBannerTitle} subtitle={home.ctaBannerSubtitle} button={home.ctaBannerButton} />
      </section>
    </PageShell>
  );
}
