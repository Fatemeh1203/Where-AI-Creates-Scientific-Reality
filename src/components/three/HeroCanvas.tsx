"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

/**
 * Loads the 3D particle field only on the client, only after mount, and
 * only when the user hasn't requested reduced motion. Keeps the initial
 * HTML light (good for SEO/AdSense) and respects accessibility.
 */
export function HeroCanvas() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) setEnabled(true);
  }, []);

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 -z-10 opacity-70 [mask-image:radial-gradient(ellipse_65%_60%_at_50%_35%,black,transparent)]">
      <ParticleField />
    </div>
  );
}
