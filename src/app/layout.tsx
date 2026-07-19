import type { Metadata } from "next";
import { Inter, Space_Grotesk, Vazirmatn } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const vazirmatn = Vazirmatn({ subsets: ["arabic"], variable: "--font-fa", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Simorgh AI Labs — AI, Photonics & Scientific Simulation",
  description:
    "Simorgh AI Labs is the studio of Fatemeh Shams, an AI engineer and physicist building intelligent simulations, fiber-optic sensor systems, scientific software, and automation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${vazirmatn.variable}`}>
      <body className="bg-night-950 text-slate-100 antialiased font-body">{children}</body>
    </html>
  );
}
