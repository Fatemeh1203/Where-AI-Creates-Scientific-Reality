import type { Metadata } from "next";
import { LegalBody } from "@/components/pages/LegalBody";
import { getContent } from "@/content";

const c = getContent("en");

export const metadata: Metadata = {
  title: `${c.legal.privacyTitle} — ${c.nav.brand}`,
  alternates: { languages: { en: "/privacy", fa: "/fa/privacy" } },
};

export default function Page() {
  return <LegalBody locale="en" page="privacy" />;
}
