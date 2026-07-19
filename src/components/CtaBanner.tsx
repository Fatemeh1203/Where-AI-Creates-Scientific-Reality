import Link from "next/link";
import type { Locale } from "@/content/schema";
import { localeHref } from "@/lib/paths";
import { PersianPattern } from "./PersianPattern";

export function CtaBanner({
  locale,
  title,
  subtitle,
  button,
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  button: string;
}) {
  return (
    <section className="container-page">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-lapis-700/40 via-night-800 to-banafsh-700/30 px-6 py-16 text-center sm:px-16">
        <PersianPattern id="cta" className="absolute inset-0 opacity-40" color="#fbbf24" opacity={0.14} size={56} />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-heading text-2xl font-bold text-white sm:text-3xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">{subtitle}</p>
          <Link href={localeHref(locale, "/order")} className="btn-primary mt-8">
            {button}
          </Link>
        </div>
      </div>
    </section>
  );
}
