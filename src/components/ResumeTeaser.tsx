import Link from "next/link";
import type { Locale, SiteContent } from "@/content/schema";
import { localeHref } from "@/lib/paths";
import { Reveal } from "./Reveal";

const label = {
  en: { eyebrow: "Who's behind the work", viewResume: "View full résumé" },
  fa: { eyebrow: "پشت این کارها", viewResume: "مشاهده رزومه‌ی کامل" },
};

export function ResumeTeaser({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { about } = content;
  const l = label[locale];

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr]">
      <Reveal>
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-start lg:flex-col lg:text-center">
          <div className="relative flex h-40 w-40 shrink-0 items-center justify-center">
            <div className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-firoozeh-400/30" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-firoozeh-500/20 via-lapis-500/15 to-banafsh-500/20 blur-lg" />
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-night-900/70 font-heading text-3xl font-bold text-white shadow-glow">
              FS
            </div>
          </div>
          <div>
            <p className="eyebrow mb-2">{l.eyebrow}</p>
            <h3 className="font-heading text-2xl font-bold text-white">{about.title}</h3>
            <p className="mt-2 gradient-text text-sm font-semibold">{about.intro}</p>
            <Link href={localeHref(locale, "/about")} className="btn-secondary mt-5 inline-flex text-xs">
              {l.viewResume}
            </Link>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-3">
        {about.skillGroups.map((group, i) => (
          <Reveal key={group.title} index={i} className="h-full">
            <div className="glass-card h-full p-5">
              <h4 className="font-heading text-sm font-semibold text-white">{group.title}</h4>
              <ul className="mt-3 space-y-1.5">
                {group.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="h-1 w-1 rounded-full bg-firoozeh-400" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
