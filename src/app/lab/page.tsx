import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LabBody } from "@/components/pages/LabBody";
import { getContent } from "@/content";
import { LAB_COOKIE_NAME, cookieIsValid } from "@/lib/labAuth";

const c = getContent("en");

export const metadata: Metadata = {
  title: `Fiber-Optic Current Sensor Simulator — ${c.nav.brand}`,
  description: "Password-protected interactive fiber-optic current sensor (Faraday effect) simulator.",
  robots: { index: false, follow: false },
  alternates: { languages: { en: "/lab", fa: "/fa/lab" } },
};

export default async function Page() {
  const cookieStore = await cookies();
  const authed = cookieIsValid(cookieStore.get(LAB_COOKIE_NAME)?.value);
  return <LabBody locale="en" authed={authed} />;
}
