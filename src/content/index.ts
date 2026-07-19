import { en } from "./en";
import { fa } from "./fa";
import type { Locale, SiteContent } from "./schema";

export const dictionaries: Record<Locale, SiteContent> = { en, fa };

export function getContent(locale: Locale): SiteContent {
  return dictionaries[locale];
}

export * from "./schema";
