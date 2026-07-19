import Link from "next/link";
import type { Locale } from "@/content/schema";
import type { SiteContent } from "@/content/schema";
import { localeHref } from "@/lib/paths";

export function Footer({ locale, content }: { locale: Locale; content: SiteContent }) {
  const { nav, footer } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-night-900/60">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <span className="font-heading text-lg font-bold text-white">{nav.brand}</span>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">{footer.tagline}</p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-slate-200">{footer.quickLinksTitle}</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link className="hover:text-firoozeh-400" href={localeHref(locale, "/about")}>{nav.about}</Link></li>
            <li><Link className="hover:text-firoozeh-400" href={localeHref(locale, "/portfolio")}>{nav.portfolio}</Link></li>
            <li><Link className="hover:text-firoozeh-400" href={localeHref(locale, "/services")}>{nav.services}</Link></li>
            <li><Link className="hover:text-firoozeh-400" href={localeHref(locale, "/order")}>{nav.order}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-slate-200">{footer.contactTitle}</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>
              <a className="hover:text-firoozeh-400" href="mailto:f.shams.apg@gmail.com">f.shams.apg@gmail.com</a>
            </li>
            <li><Link className="hover:text-firoozeh-400" href={localeHref(locale, "/contact")}>{nav.contact}</Link></li>
            <li><Link className="hover:text-firoozeh-400" href={localeHref(locale, "/privacy")}>{footer.legalPrivacy}</Link></li>
            <li><Link className="hover:text-firoozeh-400" href={localeHref(locale, "/terms")}>{footer.legalTerms}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <p className="container-page text-center text-xs text-slate-500">
          &copy; {year} {nav.brand}. {footer.rights}
        </p>
      </div>
    </footer>
  );
}
