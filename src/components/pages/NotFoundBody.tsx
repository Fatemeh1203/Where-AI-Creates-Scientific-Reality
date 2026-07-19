import Link from "next/link";
import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";
import { localeHref } from "@/lib/paths";

export function NotFoundBody({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const { common } = content;

  return (
    <PageShell locale={locale} content={content}>
      <section className="flex min-h-[60vh] items-center pb-24 pt-28">
        <div className="container-page text-center">
          <p className="font-heading text-7xl font-bold gradient-text">404</p>
          <h1 className="mt-4 font-heading text-2xl font-bold text-white">{common.notFoundTitle}</h1>
          <p className="mt-3 text-sm text-slate-400">{common.notFoundBody}</p>
          <Link href={localeHref(locale, "/")} className="btn-primary mt-8 inline-flex">
            {common.notFoundCta}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
