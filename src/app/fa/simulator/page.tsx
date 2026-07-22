import type { Metadata } from "next";
import { SimulatorBody } from "@/components/pages/SimulatorBody";
import { getContent } from "@/content";

const c = getContent("fa");

export const metadata: Metadata = {
  title: `شبیه‌ساز توری براگ فیبری — ${c.nav.brand}`,
  description:
    "شبیه‌ساز تعاملی و مبتنی بر فیزیک حسگر فیبر نوری (FBG) — دما و کرنش را تغییر دهید و جابه‌جایی زنده‌ی طول‌موج براگ را ببینید.",
  alternates: { languages: { en: "/simulator", fa: "/fa/simulator" } },
};

export default function Page() {
  return <SimulatorBody locale="fa" />;
}
