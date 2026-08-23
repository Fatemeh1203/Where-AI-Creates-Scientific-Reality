# Simorgh AI Labs

The portfolio & client-acquisition website for **Fatemeh Shams** — AI engineer & physicist working across machine learning, fiber-optic sensing, scientific simulation, automation, and web engineering.

Bilingual (English default, Persian available at `/fa`), built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. Includes a working contact form, a project/quote request form with an optional deposit payment (ZarinPal), Supabase storage, and email notifications.

## Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS — custom "Persian modern" theme (turquoise / lapis blue / gold / violet) with hand-drawn girih (Persian geometric) pattern backgrounds
- **Database:** Supabase (Postgres) — `contact_messages` and `orders` tables
- **Email:** Resend
- **Payments:** ZarinPal (Iranian payment gateway), sandbox-ready out of the box
- **i18n:** English at `/`, Persian at `/fa`, with a language switcher and full RTL layout for Persian

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Visit `http://localhost:3000` (English) and `http://localhost:3000/fa` (Persian).

## Environment variables

See `.env.example` for the full list. The important ones to set before going live:

| Variable | Required for | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Database | Already filled in for the project created for this site. |
| `SUPABASE_SERVICE_ROLE_KEY` | Contact & order forms | **Secret.** Get it from Supabase Dashboard → Project Settings → API. Without it, form submissions will fail to save. |
| `RESEND_API_KEY` | Email notifications | Get a free key at [resend.com](https://resend.com). Without it, submissions still save to Supabase but no email is sent. |
| `NOTIFICATIONS_TO_EMAIL` | Email notifications | Defaults to `f.shams.apg@gmail.com`. |
| `ZARINPAL_MERCHANT_ID` / `ZARINPAL_SANDBOX` | Deposit payments | Defaults to ZarinPal's public sandbox merchant, so payments work in test mode immediately. Set your real merchant ID and `ZARINPAL_SANDBOX=false` to accept real money. |
| `NEXT_PUBLIC_SITE_URL` | SEO | Your production domain, used in the sitemap and metadata. |

## Editing your content

Almost everything you'll want to personalize (your name, bio, skills, resume timeline, portfolio projects, services & prices, legal pages) lives in two files as plain TypeScript objects:

- `src/content/en.ts` — English copy
- `src/content/fa.ts` — Persian copy (translate/update alongside the English file — the two must have matching structure, defined in `src/content/schema.ts`)

Portfolio projects are entries in `portfolio.projects` in those files — add a new object (with a unique `slug`) to add a new case study page automatically at `/portfolio/<slug>` (and `/fa/portfolio/<slug>`).

## Database schema

Two tables were created in the connected Supabase project:

- `contact_messages` — submissions from the `/contact` page
- `orders` — submissions from the `/order` (project request) page, including payment status/amount when a deposit is requested

Both tables have Row Level Security enabled with **no public policies** — only server-side API routes using the service role key can read/write them, so form data can't be scraped or tampered with by anonymous clients. To view submissions, use the Supabase Dashboard's Table Editor, or connect a BI tool with the service role key.

## Payments

The `/order` form lets a visitor optionally pay a deposit via **ZarinPal**. Flow:

1. `/api/orders` saves the request to Supabase, emails you, and (if a deposit was requested) asks ZarinPal for a payment link.
2. The visitor is redirected to ZarinPal to pay.
3. ZarinPal redirects back to `/api/payment/zarinpal/callback`, which verifies the payment and updates the order's `payment_status` in Supabase.
4. The visitor lands on `/order/result` with a success/cancelled/error message.

By default this runs against ZarinPal's **sandbox** (test) environment — no real money moves and no merchant account is needed to try it. Switch to production by setting `ZARINPAL_MERCHANT_ID` (from your ZarinPal merchant dashboard) and `ZARINPAL_SANDBOX=false`.

If you'd rather accept international card payments instead of (or alongside) ZarinPal, `src/lib/zarinpal.ts` is a small, self-contained module you can swap for a Stripe equivalent without touching the rest of the app.

## Deployment

The app is a standard Next.js app and deploys cleanly to Vercel:

```bash
npm run build
```

Set all the environment variables from `.env.example` in your hosting provider's dashboard before going live.

## Before submitting to Google AdSense

- Update `NEXT_PUBLIC_SITE_URL` to your real domain.
- Fill in real portfolio case studies, publications, and a real photo if you'd like (currently a placeholder monogram is used on the About page).
- Add a real `ads.txt` file at the project root once AdSense gives you your publisher ID.
- Review `/privacy` and `/terms` and adjust to your actual business details/jurisdiction.

<!-- FIBER-MONITOR:START -->

## 🔬 Optical Fiber Sensors — Daily Research Monitor

An automated pipeline that every day discovers, vets, analyses (bilingual EN/FA)
and logs the newest peer-reviewed and preprint literature on optical fiber
sensing. See [`docs/RESEARCH_MONITOR.md`](docs/RESEARCH_MONITOR.md) for the design.

| Metric | Value |
|---|---|
| 🕒 Last update | **2026-08-23** |
| 📚 Total papers tracked | **105** |
| 🗓️ Papers this week | **2** |
| 📰 Distinct journals/venues | **1** |

**🔥 Hot topics**

| Research area | Papers |
|---|---|
| Distributed Acoustic Sensing (DAS) | 20 |
| Distributed Fiber Optic Sensing (DFOS) | 20 |
| Fiber Bragg Grating (FBG) | 17 |
| Photonic / Silicon-Photonics Sensors | 17 |
| Optical Fiber Sensors | 14 |
| Quantum Fiber Sensors | 6 |

📈 Chart: [`Figures/papers_by_area.svg`](Figures/papers_by_area.svg) ·
🗂️ Database: [`Database/papers.csv`](Database/papers.csv) ·
📄 Latest report: [`Reports/2026-08-23.md`](Reports/2026-08-23.md)

<!-- FIBER-MONITOR:END -->

---

## 🌐 Automation demos / دموی اتوماسیون‌ها

**English** — Interactive demos of my n8n automation workflows, running live in the browser:
👉 **https://fatemeh1203.github.io/n8n-special-Arezou-/**

**فارسی** — دموی تعاملی گردش‌کارهای n8n که ساخته‌ام؛ هر اتوماسیون را می‌توانید همان‌جا در مرورگر اجرا کنید:
👉 **https://fatemeh1203.github.io/n8n-special-Arezou-/**

By **Fatemeh Shams** — از **فاطمه شمس** ·
[LinkedIn](https://www.linkedin.com/in/fatemeh-shams/) · [fatemeh.shams19@gmail.com](mailto:fatemeh.shams19@gmail.com) · [GitHub](https://github.com/Fatemeh1203)
