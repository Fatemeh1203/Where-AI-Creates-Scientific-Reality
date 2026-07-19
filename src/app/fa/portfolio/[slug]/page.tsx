import type { Metadata } from "next";
import { PortfolioDetailBody } from "@/components/pages/PortfolioDetailBody";
import { getContent } from "@/content";

const c = getContent("fa");

export function generateStaticParams() {
  return c.portfolio.projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = c.portfolio.projects.find((p) => p.slug === slug);
  return {
    title: project ? `${project.title} — ${c.nav.brand}` : c.nav.brand,
    description: project?.summary,
    alternates: { languages: { en: `/portfolio/${slug}`, fa: `/fa/portfolio/${slug}` } },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PortfolioDetailBody locale="fa" slug={slug} />;
}
