import Link from "next/link";
import type { Locale, PortfolioProject } from "@/content/schema";
import { localeHref } from "@/lib/paths";
import { Icon } from "./Icons";

export function ProjectCard({ project, locale, viewLabel }: { project: PortfolioProject; locale: Locale; viewLabel: string }) {
  return (
    <Link
      href={localeHref(locale, `/portfolio/${project.slug}`)}
      className="glass-card group flex h-full flex-col p-6 transition-all hover:-translate-y-1 hover:border-firoozeh-400/30"
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-firoozeh-500/20 to-banafsh-500/10 text-firoozeh-400">
          <Icon name={project.icon} className="h-5 w-5" />
        </span>
        <span className="badge">{project.year}</span>
      </div>
      <p className="eyebrow !text-[11px]">{project.category}</p>
      <h3 className="mt-2 font-heading text-lg font-semibold text-white">{project.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{project.summary}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">
            {tag}
          </span>
        ))}
      </div>
      <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-firoozeh-400 transition-transform group-hover:gap-2">
        {viewLabel}
        <span aria-hidden className="inline-block rtl:rotate-180">→</span>
      </span>
    </Link>
  );
}
