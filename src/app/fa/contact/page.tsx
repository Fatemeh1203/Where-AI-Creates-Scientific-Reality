import type { Metadata } from "next";
import { ContactBody } from "@/components/pages/ContactBody";
import { getContent } from "@/content";

const c = getContent("fa");

export const metadata: Metadata = {
  title: `${c.contact.title} — ${c.nav.brand}`,
  description: c.contact.subtitle,
  alternates: { languages: { en: "/contact", fa: "/fa/contact" } },
};

export default function Page() {
  return <ContactBody locale="fa" />;
}
