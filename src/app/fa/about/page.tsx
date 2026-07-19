import type { Metadata } from "next";
import { AboutBody } from "@/components/pages/AboutBody";
import { getContent } from "@/content";

const c = getContent("fa");

export const metadata: Metadata = {
  title: `${c.about.title} — ${c.nav.brand}`,
  description: c.about.intro,
  alternates: { languages: { en: "/about", fa: "/fa/about" } },
};

export default function Page() {
  return <AboutBody locale="fa" />;
}
