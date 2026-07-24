import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LabBody } from "@/components/pages/LabBody";
import { getContent } from "@/content";
import { LAB_COOKIE_NAME, cookieIsValid } from "@/lib/labAuth";

const c = getContent("fa");

export const metadata: Metadata = {
  title: `شبیه‌ساز حسگر جریان فیبر نوری — ${c.nav.brand}`,
  description: "شبیه‌ساز تعاملی حسگر جریان فیبر نوری (اثر فارادی)، محافظت‌شده با رمز.",
  robots: { index: false, follow: false },
  alternates: { languages: { en: "/lab", fa: "/fa/lab" } },
};

export default async function Page() {
  const cookieStore = await cookies();
  const authed = cookieIsValid(cookieStore.get(LAB_COOKIE_NAME)?.value);
  return <LabBody locale="fa" authed={authed} />;
}
