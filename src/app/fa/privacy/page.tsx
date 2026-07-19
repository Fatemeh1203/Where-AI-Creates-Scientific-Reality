import type { Metadata } from "next";
import { LegalBody } from "@/components/pages/LegalBody";
import { getContent } from "@/content";

const c = getContent("fa");

export const metadata: Metadata = {
  title: `${c.legal.privacyTitle} — ${c.nav.brand}`,
  alternates: { languages: { en: "/privacy", fa: "/fa/privacy" } },
};

export default function Page() {
  return <LegalBody locale="fa" page="privacy" />;
}
