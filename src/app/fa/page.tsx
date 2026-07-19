import type { Metadata } from "next";
import { HomeBody } from "@/components/pages/HomeBody";
import { getContent } from "@/content";

const c = getContent("fa");

export const metadata: Metadata = {
  title: c.meta.title,
  description: c.meta.description,
  keywords: c.meta.keywords,
  alternates: { languages: { en: "/", fa: "/fa" } },
};

export default function Page() {
  return <HomeBody locale="fa" />;
}
