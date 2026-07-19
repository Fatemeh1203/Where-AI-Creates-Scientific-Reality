import Link from "next/link";
import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";
import { SectionHeading } from "@/components/SectionHeading";
import { Timeline } from "@/components/Timeline";
import { PersianPattern } from "@/components/PersianPattern";
import { localeHref } from "@/lib/paths";

export function AboutBody({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const { about } = content;

  return (
    <PageShell locale={locale} content={content}>
      <section className="relative overflow-hidden pb-16 pt-16 sm:pt-24">
        <PersianPattern id="about-hero" className="absolute inset-0 -z-10 opacity-40" color="#a855f7" opacity={0.1} />
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="text-center lg:text-start">
            <p className="eyebrow mb-3">{about.eyebrow}</p>
            <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">{about.title}</h1>
            <p className="mt-4 gradient-text font-heading text-lg font-semibold">{about.intro}</p>
            <div className="mx-auto mt-6 max-w-xl space-y-4 text-start text-sm leading-relaxed text-slate-400 lg:mx-0">
              {about.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <Link href={localeHref(locale, "/order")} className="btn-primary mt-8 inline-flex">
              {content.nav.cta}
            </Link>
          </div>

          <div className="relative mx-auto flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
            <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-firoozeh-400/30" />
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-firoozeh-500/20 via-lapis-500/15 to-banafsh-500/20 blur-xl" />
            <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-white/10 bg-night-900/60 font-heading text-5xl font-bold text-white shadow-glow sm:h-60 sm:w-60">
              FS
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <SectionHeading title={about.skillsTitle} align="start" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {about.skillGroups.map((group) => (
              <div key={group.title} className="glass-card p-6">
                <h3 className="font-heading text-base font-semibold text-white">{group.title}</h3>
                <ul className="mt-4 space-y-2">
                  {group.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-firoozeh-400" />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-night-900/40">
        <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading title={about.educationTitle} align="start" />
            <div className="mt-10">
              <Timeline items={about.education} />
            </div>
          </div>
          <div>
            <SectionHeading title={about.experienceTitle} align="start" />
            <div className="mt-10">
              <Timeline items={about.experience} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <SectionHeading title={about.publicationsTitle} align="start" />
          <ul className="mt-8 space-y-4">
            {about.publications.map((pub) => (
              <li key={pub} className="glass-card flex items-start gap-3 p-5 text-sm text-slate-300">
                <span className="mt-0.5 text-firoozeh-400">◆</span>
                {pub}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageShell>
  );
}
