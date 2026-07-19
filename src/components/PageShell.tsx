import type { Locale, SiteContent } from "@/content/schema";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({
  locale,
  content,
  children,
}: {
  locale: Locale;
  content: SiteContent;
  children: React.ReactNode;
}) {
  return (
    <div dir={locale === "fa" ? "rtl" : "ltr"} lang={locale} className="relative flex min-h-screen flex-col overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-aurora-gradient" />
      <Navbar locale={locale} nav={content.nav} switchLabel={content.common.switchLang} />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} content={content} />
    </div>
  );
}
