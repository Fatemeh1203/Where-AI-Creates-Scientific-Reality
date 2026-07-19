import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        night: {
          950: "#05070f",
          900: "#0a0e1a",
          800: "#0f1526",
          700: "#161d33",
        },
        firoozeh: {
          400: "#5eead4",
          500: "#14b8a6",
          600: "#0d9488",
        },
        lapis: {
          400: "#60a5fa",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e3a8a",
        },
        anar: {
          400: "#fb7185",
          500: "#e11d48",
          600: "#be123c",
        },
        zar: {
          300: "#fde68a",
          400: "#fbbf24",
          500: "#f59e0b",
        },
        banafsh: {
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        fa: ["var(--font-fa)"],
      },
      backgroundImage: {
        "aurora-gradient":
          "radial-gradient(60% 60% at 15% 10%, rgba(20,184,166,0.25) 0%, rgba(20,184,166,0) 60%), radial-gradient(50% 50% at 85% 15%, rgba(168,85,247,0.25) 0%, rgba(168,85,247,0) 60%), radial-gradient(60% 60% at 50% 100%, rgba(37,99,235,0.3) 0%, rgba(37,99,235,0) 60%)",
        "hero-grid":
          "linear-gradient(rgba(94,234,212,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(94,234,212,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(20,184,166,0.5)",
        "glow-purple": "0 0 40px -10px rgba(168,85,247,0.5)",
        "glow-gold": "0 0 30px -8px rgba(251,191,36,0.6)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
