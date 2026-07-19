import type { Locale } from "@/content/schema";

/** Builds a link href for the given locale. `path` should start with "/" (use "" for home). */
export function localeHref(locale: Locale, path: string = "") {
  const prefix = locale === "fa" ? "/fa" : "";
  if (!path || path === "/") return prefix || "/";
  return `${prefix}${path}`;
}

/** Given the current pathname, returns the equivalent path in the target locale. */
export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const isCurrentlyFa = pathname === "/fa" || pathname.startsWith("/fa/");

  if (targetLocale === "fa") {
    if (isCurrentlyFa) return pathname;
    return pathname === "/" ? "/fa" : `/fa${pathname}`;
  }

  if (!isCurrentlyFa) return pathname;
  const stripped = pathname.slice(3);
  return stripped === "" ? "/" : stripped;
}
