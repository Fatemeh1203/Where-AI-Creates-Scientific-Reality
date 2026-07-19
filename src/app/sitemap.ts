import type { MetadataRoute } from "next";
import { getContent } from "@/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const staticPaths = ["", "/about", "/portfolio", "/services", "/contact", "/order", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const projectSlugs = getContent("en").portfolio.projects.map((p) => `/portfolio/${p.slug}`);
  const allPaths = [...staticPaths, ...projectSlugs.filter((p) => !staticPaths.includes(p))];

  const entries: MetadataRoute.Sitemap = [];

  for (const path of allPaths) {
    entries.push({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
    });
    entries.push({
      url: `${SITE_URL}/fa${path === "" ? "" : path}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: path === "" ? 0.9 : 0.6,
    });
  }

  return entries;
}
