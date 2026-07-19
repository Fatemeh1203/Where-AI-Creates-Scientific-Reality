import type { Metadata } from "next";
import { PortfolioListBody } from "@/components/pages/PortfolioListBody";
import { getContent } from "@/content";

const c = getContent("fa");

export const metadata: Metadata = {
  title: `${c.portfolio.title} — ${c.nav.brand}`,
  description: c.portfolio.subtitle,
  alternates: { languages: { en: "/portfolio", fa: "/fa/portfolio" } },
};

export default function Page() {
  return <PortfolioListBody locale="fa" />;
}
