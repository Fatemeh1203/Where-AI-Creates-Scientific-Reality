import type { Metadata } from "next";
import { LegalBody } from "@/components/pages/LegalBody";
import { getContent } from "@/content";

const c = getContent("en");

export const metadata: Metadata = {
  title: `${c.legal.termsTitle} — ${c.nav.brand}`,
  alternates: { languages: { en: "/terms", fa: "/fa/terms" } },
};

export default function Page() {
  return <LegalBody locale="en" page="terms" />;
}
