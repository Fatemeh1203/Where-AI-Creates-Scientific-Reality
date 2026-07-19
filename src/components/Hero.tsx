import Link from "next/link";
import type { HeroContent, Locale } from "@/content/schema";
import { localeHref } from "@/lib/paths";
import { PersianPattern } from "./PersianPattern";

export function Hero({ locale, hero }: { locale: Locale; hero: HeroContent }) {
  return (
    <section className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
      <div className="absolute inset-0 -z-10 bg-hero-grid bg-[length:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <PersianPattern
        id="hero"
        className="absolute inset-x-0 top-0 -z-10 h-[560px] opacity-60 [mask-image:radial-gradient(ellipse_55%_55%_at_50%_10%,black,transparent)]"
        color="#5eead4"
        opacity={0.16}
      />

      <div className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 animate-pulse-slow rounded-full bg-firoozeh-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 -z-10 h-72 w-72 animate-float-slow rounded-full bg-banafsh-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 top-64 -z-10 h-72 w-72 animate-float rounded-full bg-lapis-500/15 blur-3xl" />

      <div className="container-page relative text-center">
        <p className="eyebrow mx-auto mb-6 inline-flex rounded-full border border-firoozeh-500/25 bg-firoozeh-500/5 px-4 py-1.5">
          {hero.eyebrow}
        </p>

        <h1 className="mx-auto max-w-4xl font-heading text-4xl font-bold leading-[1.15] text-white sm:text-5xl md:text-6xl">
          {hero.titleLine1}{" "}
          <span className="gradient-text">{hero.titleHighlight}</span> {hero.titleLine2}
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">{hero.subtitle}</p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href={localeHref(locale, "/order")} className="btn-primary">
            {hero.ctaPrimary}
          </Link>
          <Link href={localeHref(locale, "/portfolio")} className="btn-secondary">
            {hero.ctaSecondary}
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {hero.badges.map((badge) => (
            <span key={badge} className="badge">
              {badge}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3">
          {hero.stats.map((stat) => (
            <div key={stat.label} className="glass-card px-5 py-6">
              <p className="font-heading text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="mt-1 text-xs leading-snug text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
