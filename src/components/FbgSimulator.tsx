"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/content/schema";

/**
 * Interactive Fiber Bragg Grating (FBG) sensor simulator.
 *
 * Physics:
 *   Bragg wavelength:        λ_B = 2 · n_eff · Λ
 *   Relative shift:          Δλ_B / λ_B = (α + ξ)·ΔT + (1 − p_e)·ε
 *     α   ≈ 0.55e-6 /°C   thermal expansion of silica
 *     ξ   ≈ 8.6e-6  /°C   thermo-optic coefficient
 *     p_e ≈ 0.22          effective photo-elastic constant
 *     ε                   axial strain (microstrain, 1e-6)
 *
 * The reflection spectrum of a uniform grating is approximated with a
 * sinc²-shaped main lobe plus side lobes, which visibly shifts as the
 * measurand changes. An optional measurement-noise layer illustrates why
 * an ML denoising/calibration stage (see the portfolio case study) matters.
 */

const LAMBDA0 = 1550; // nm, Bragg wavelength at reference conditions
const REF_TEMP = 25; // °C reference
const ALPHA = 0.55e-6; // /°C
const XI = 8.6e-6; // /°C
const PE = 0.22; // photo-elastic constant

const dict = {
  en: {
    temperature: "Temperature",
    strain: "Strain",
    noise: "Add measurement noise",
    reset: "Reset",
    braggShift: "Bragg wavelength shift",
    peakWavelength: "Peak wavelength",
    tempSens: "Temperature sensitivity",
    strainSens: "Strain sensitivity",
    reference: "Reference peak (25 °C, 0 με)",
    live: "Live peak",
    axisX: "Wavelength (nm)",
    axisY: "Reflectivity",
    formula: "Δλ_B / λ_B = (α + ξ)·ΔT + (1 − p_e)·ε",
    note: "Drag the sliders. The reflected spectral peak of the grating shifts with temperature and strain exactly as a real FBG sensor would — this is the forward model a calibration or denoising algorithm is built on top of.",
    pm: "pm",
    microstrain: "με",
  },
  fa: {
    temperature: "دما",
    strain: "کرنش",
    noise: "افزودن نویز اندازه‌گیری",
    reset: "بازنشانی",
    braggShift: "جابه‌جایی طول‌موج براگ",
    peakWavelength: "طول‌موج قله",
    tempSens: "حساسیت دمایی",
    strainSens: "حساسیت کرنشی",
    reference: "قله‌ی مرجع (۲۵ درجه، ۰ میکروکرنش)",
    live: "قله‌ی زنده",
    axisX: "طول‌موج (نانومتر)",
    axisY: "بازتابندگی",
    formula: "Δλ_B / λ_B = (α + ξ)·ΔT + (1 − p_e)·ε",
    note: "اسلایدرها را حرکت دهید. قله‌ی طیف بازتابی توری، با دما و کرنش دقیقاً مانند یک حسگر واقعی FBG جابه‌جا می‌شود — این همان مدل مستقیمی است که الگوریتم کالیبراسیون یا حذف نویز روی آن ساخته می‌شود.",
    pm: "پیکومتر",
    microstrain: "میکروکرنش",
  },
};

function faNum(value: string, locale: Locale) {
  if (locale !== "fa") return value;
  const map: Record<string, string> = { "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴", "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹" };
  return value.replace(/[0-9]/g, (d) => map[d]);
}

export function FbgSimulator({ locale }: { locale: Locale }) {
  const t = dict[locale];
  const [temp, setTemp] = useState(25);
  const [strain, setStrain] = useState(0);
  const [noise, setNoise] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const deltaT = temp - REF_TEMP;
  const relShift = (ALPHA + XI) * deltaT + (1 - PE) * (strain * 1e-6);
  const shiftNm = LAMBDA0 * relShift;
  const shiftPm = shiftNm * 1000;
  const peakWavelength = LAMBDA0 + shiftNm;

  const tempSensPmPerC = LAMBDA0 * (ALPHA + XI) * 1000; // pm/°C
  const strainSensPmPerUe = LAMBDA0 * (1 - PE) * 1e-6 * 1000; // pm/με

  // Static noise sample set so the curve is stable per render frame.
  const noiseSeed = useMemo(() => Array.from({ length: 600 }, () => Math.random() - 0.5), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    const padL = 46;
    const padR = 16;
    const padT = 14;
    const padB = 34;
    const plotW = cssW - padL - padR;
    const plotH = cssH - padT - padB;

    // Wavelength window wide enough to keep the peak on-screen across the
    // full slider range (max shift ≈ +4.9 nm at 200 °C & 2000 με).
    const winMin = LAMBDA0 - 1.5;
    const winMax = LAMBDA0 + 5.7;
    const xOf = (lam: number) => padL + ((lam - winMin) / (winMax - winMin)) * plotW;
    const yOf = (r: number) => padT + (1 - r) * plotH;

    // Grid
    ctx.strokeStyle = "rgba(148,163,184,0.12)";
    ctx.lineWidth = 1;
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "rgba(148,163,184,0.6)";
    for (let i = 0; i <= 4; i++) {
      const lam = winMin + ((winMax - winMin) * i) / 4;
      const x = xOf(lam);
      ctx.beginPath();
      ctx.moveTo(x, padT);
      ctx.lineTo(x, padT + plotH);
      ctx.stroke();
      ctx.textAlign = "center";
      ctx.fillText(faNum(lam.toFixed(1), locale), x, cssH - 12);
    }
    for (let i = 0; i <= 4; i++) {
      const r = i / 4;
      const y = yOf(r);
      ctx.beginPath();
      ctx.moveTo(padL, y);
      ctx.lineTo(padL + plotW, y);
      ctx.stroke();
      ctx.textAlign = "right";
      ctx.fillText(faNum(r.toFixed(2), locale), padL - 6, y + 3);
    }

    // Uniform-grating reflection profile: sinc²-like main lobe + side lobes.
    const bandwidth = 0.25; // nm, main-lobe half width
    const profile = (lam: number, center: number) => {
      const x = (lam - center) / bandwidth;
      if (Math.abs(x) < 1e-6) return 1;
      const s = Math.sin(Math.PI * x) / (Math.PI * x);
      return Math.max(0, s * s);
    };

    const drawCurve = (center: number, color: string, withNoise: boolean, fill: boolean) => {
      ctx.beginPath();
      const N = 600;
      for (let i = 0; i <= N; i++) {
        const lam = winMin + ((winMax - winMin) * i) / N;
        let r = profile(lam, center) * 0.98;
        if (withNoise) r = Math.min(1, Math.max(0, r + noiseSeed[i % noiseSeed.length] * 0.06));
        const x = xOf(lam);
        const y = yOf(r);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      if (fill) {
        ctx.lineTo(xOf(winMax), yOf(0));
        ctx.lineTo(xOf(winMin), yOf(0));
        ctx.closePath();
        const grad = ctx.createLinearGradient(0, padT, 0, padT + plotH);
        grad.addColorStop(0, color.replace(")", ",0.35)").replace("rgb", "rgba"));
        grad.addColorStop(1, color.replace(")", ",0)").replace("rgb", "rgba"));
        ctx.fillStyle = grad;
        ctx.fill();
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    // Reference (ghost) peak at base wavelength.
    ctx.setLineDash([4, 4]);
    drawCurve(LAMBDA0, "rgb(148,163,184)", false, false);
    ctx.setLineDash([]);

    // Live peak (filled + stroked).
    drawCurve(peakWavelength, "rgb(45,212,191)", noise, true);
    drawCurve(peakWavelength, "rgb(94,234,212)", noise, false);

    // Peak marker line.
    const px = xOf(peakWavelength);
    if (px >= padL && px <= padL + plotW) {
      ctx.strokeStyle = "rgba(251,191,36,0.8)";
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(px, padT);
      ctx.lineTo(px, padT + plotH);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [peakWavelength, noise, noiseSeed, locale]);

  const fmt = (v: number, d = 0) => faNum(v.toFixed(d), locale);

  return (
    <div className="glass-card p-5 sm:p-7">
      <div className="relative h-64 w-full sm:h-80">
        <canvas ref={canvasRef} className="h-full w-full" />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-4 rounded-full bg-firoozeh-400" /> {t.live}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-0 w-4 border-t border-dashed border-slate-400" /> {t.reference}
        </span>
        <span>{t.axisX}</span>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <label htmlFor="temp" className="font-medium text-slate-300">{t.temperature}</label>
            <span className="font-heading text-firoozeh-400">{fmt(temp)} °C</span>
          </div>
          <input
            id="temp"
            type="range"
            min={-40}
            max={200}
            step={1}
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="w-full accent-firoozeh-500"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <label htmlFor="strain" className="font-medium text-slate-300">{t.strain}</label>
            <span className="font-heading text-lapis-400">{fmt(strain)} {t.microstrain}</span>
          </div>
          <input
            id="strain"
            type="range"
            min={0}
            max={2000}
            step={10}
            value={strain}
            onChange={(e) => setStrain(Number(e.target.value))}
            className="w-full accent-lapis-500"
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label={t.braggShift} value={`${shiftPm >= 0 ? "+" : ""}${fmt(shiftPm, 0)} ${t.pm}`} accent="gold" locale={locale} />
        <Stat label={t.peakWavelength} value={`${fmt(peakWavelength, 3)} nm`} accent="teal" locale={locale} />
        <Stat label={t.tempSens} value={`${fmt(tempSensPmPerC, 1)} ${t.pm}/°C`} accent="blue" locale={locale} />
        <Stat label={t.strainSens} value={`${fmt(strainSensPmPerUe, 2)} ${t.pm}/${t.microstrain}`} accent="purple" locale={locale} />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" checked={noise} onChange={(e) => setNoise(e.target.checked)} className="h-4 w-4 accent-anar-500" />
          {t.noise}
        </label>
        <button
          onClick={() => { setTemp(25); setStrain(0); setNoise(false); }}
          className="btn-secondary !px-5 !py-2 text-xs"
        >
          {t.reset}
        </button>
      </div>

      <p className="mt-6 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-center font-mono text-xs text-firoozeh-300">
        {t.formula}
      </p>
      <p className="mt-3 text-center text-sm leading-relaxed text-slate-400">{t.note}</p>
    </div>
  );
}

function Stat({ label, value, accent, locale }: { label: string; value: string; accent: "gold" | "teal" | "blue" | "purple"; locale: Locale }) {
  const color = {
    gold: "text-zar-400",
    teal: "text-firoozeh-400",
    blue: "text-lapis-400",
    purple: "text-banafsh-400",
  }[accent];
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center" dir={locale === "fa" ? "rtl" : "ltr"}>
      <p className={`font-heading text-base font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-[11px] leading-tight text-slate-500">{label}</p>
    </div>
  );
}
