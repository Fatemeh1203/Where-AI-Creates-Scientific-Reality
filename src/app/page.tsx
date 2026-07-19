import type { Metadata } from "next";
import { HomeBody } from "@/components/pages/HomeBody";
import { getContent } from "@/content";

export const metadata: Metadata = {
  title: getContent("en").meta.title,
  description: getContent("en").meta.description,
  keywords: getContent("en").meta.keywords,
  alternates: { languages: { en: "/", fa: "/fa" } },
};

export default function Page() {
  return <HomeBody locale="en" />;
}
