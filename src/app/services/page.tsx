import type { Metadata } from "next";
import { ServicesBody } from "@/components/pages/ServicesBody";
import { getContent } from "@/content";

const c = getContent("en");

export const metadata: Metadata = {
  title: `${c.services.title} — ${c.nav.brand}`,
  description: c.services.subtitle,
  alternates: { languages: { en: "/services", fa: "/fa/services" } },
};

export default function Page() {
  return <ServicesBody locale="en" />;
}
