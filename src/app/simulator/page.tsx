import type { Metadata } from "next";
import { SimulatorBody } from "@/components/pages/SimulatorBody";
import { getContent } from "@/content";

const c = getContent("en");

export const metadata: Metadata = {
  title: `Fiber Bragg Grating Simulator — ${c.nav.brand}`,
  description:
    "Interactive, physics-based Fiber Bragg Grating (FBG) sensor simulator — adjust temperature and strain and watch the reflected Bragg wavelength shift in real time.",
  alternates: { languages: { en: "/simulator", fa: "/fa/simulator" } },
};

export default function Page() {
  return <SimulatorBody locale="en" />;
}
