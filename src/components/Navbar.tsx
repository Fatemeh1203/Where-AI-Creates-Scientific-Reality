"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavContent } from "@/content/schema";
import type { Locale } from "@/content/schema";
import { localeHref, switchLocalePath } from "@/lib/paths";

export function Navbar({ locale, nav, switchLabel }: { locale: Locale; nav: NavContent; switchLabel: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const targetLocale: Locale = locale === "fa" ? "en" : "fa";
  const langHref = switchLocalePath(pathname || "/", targetLocale);

  const links = [
    { href: localeHref(locale, "/"), label: nav.home },
    { href: localeHref(locale, "/about"), label: nav.about },
    { href: localeHref(locale, "/portfolio"), label: nav.portfolio },
    { href: localeHref(locale, "/services"), label: nav.services },
    { href: localeHref(locale, "/simulator"), label: nav.simulator },
    { href: localeHref(locale, "/contact"), label: nav.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-night-950/80 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href={localeHref(locale, "/")} className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-firoozeh-500 via-lapis-500 to-banafsh-500 text-sm font-bold text-white">
            سی
          </span>
          <span className="font-heading text-base font-bold text-white">{nav.brand}</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-slate-300 transition-colors hover:text-firoozeh-400">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href={langHref} className="badge transition-colors hover:border-firoozeh-400/50 hover:text-firoozeh-300">
            {switchLabel}
          </Link>
          <Link href={localeHref(locale, "/order")} className="btn-primary !px-5 !py-2.5 text-xs">
            {nav.cta}
          </Link>
        </div>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-200 md:hidden"
        >
          <span className="relative block h-3.5 w-4">
            <span className={`absolute left-0 top-0 h-0.5 w-4 bg-current transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-4 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`absolute left-0 top-3 h-0.5 w-4 bg-current transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-night-950/95 px-5 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link href={langHref} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-firoozeh-300 hover:bg-white/5">
              {switchLabel}
            </Link>
            <Link
              href={localeHref(locale, "/order")}
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full text-xs"
            >
              {nav.cta}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
