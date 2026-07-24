# 🔬 Optical Fiber Sensors — Daily Research Monitor (design & operations)

An automated system that, every day, discovers the newest scientific literature
on **optical fiber sensors**, vets and analyses it (bilingual English/Persian),
stores it in a database, produces a daily report, and updates this repository.

---

## 1. What it does

1. **Discover** the newest papers across every optical-fiber-sensing sub-topic.
2. **Vet** quality/credibility (venue, recency, review/Q1/highly-cited signals).
3. **Analyse** each paper — bilingual summary + research problem, innovation,
   method, key results, limitations, applications, read-recommendation, and a
   1–5★ rating with justification.
4. **Store** everything in `papers.json` (source of truth) + `Database/papers.csv`.
5. **Report** a daily digest at `Reports/YYYY-MM-DD.md`.
6. **Update** the README statistics and figures.
7. **Commit & push** using Conventional Commits.

## 2. Repository layout

```
.
├── papers.json                # source of truth (all records + bilingual analysis)
├── README.md                  # auto-updated stats block (FIBER-MONITOR markers)
├── Database/
│   └── papers.csv             # flat, spreadsheet-friendly view (regenerated)
├── Reports/
│   └── YYYY-MM-DD.md          # bilingual daily report
├── Analysis/
│   └── YYYY-MM-DD-trends.md   # per-day trend analysis
├── Figures/
│   ├── papers_by_area.svg     # always generated (no deps)
│   └── papers_by_area.png     # generated when matplotlib is present
├── Scripts/                   # the modular pipeline (see §3)
├── logs/                      # per-run logs
├── docs/
│   └── RESEARCH_MONITOR.md    # this file
└── .github/workflows/
    └── daily-fiber-sensor-monitor.yml
```

## 3. Pipeline modules (`Scripts/`)

| Module | Responsibility |
|---|---|
| `config.py` | Topics, sources, selection criteria, paths — all tunable knobs. |
| `logging_setup.py` | Shared logger → console + `logs/run-YYYY-MM-DD.log`. |
| `sources.py` | Fetchers: **arXiv** (Atom API, always tagged *Preprint*) + **Crossref** (trusted publishers only). Both degrade gracefully. |
| `dedupe.py` | Duplicate detection by normalised DOI / arXiv id / title. |
| `analyze.py` | Bilingual analysis + rating. LLM mode (Anthropic API) or template fallback. |
| `database.py` | Load/save `papers.json`; regenerate `Database/papers.csv`. |
| `report.py` | Build `Reports/YYYY-MM-DD.md` with previous-day comparison. |
| `figures.py` | SVG (always) + optional PNG charts. |
| `readme_updater.py` | Rewrite only the README `FIBER-MONITOR` block. |
| `run_daily.py` | Orchestrator. Never aborts the whole run on one failure. |

## 4. Sources & credibility policy

Only reputable venues are used: **IEEE Xplore, Springer, Nature,
ScienceDirect/Elsevier, Optica, Wiley, Taylor & Francis, MDPI, ACS, SPIE**, and
**arXiv** (preprints, always clearly flagged `Preprint`). Google Scholar links
are attached per paper for citation/impact lookups. Non-scientific sources are
never used.

**Selection priority:** published within 7 days → highly cited → review →
high-novelty → Q1 journals. Duplicates are rejected against the full history.

## 5. Running it

```bash
python -m pip install -r Scripts/requirements.txt

# Full fetch + analyse + report (needs open network for arXiv/Crossref):
python Scripts/run_daily.py

# Rebuild CSV/report/figures/README from the existing papers.json only:
python Scripts/run_daily.py --regenerate
```

### Optional bilingual LLM analysis
Set `ANTHROPIC_API_KEY` (and optionally `ANTHROPIC_MODEL`) to have
`analyze.py` produce the full bilingual analysis automatically; otherwise a
deterministic template is emitted for a human analyst to complete.

## 6. Automation (GitHub Actions)

`.github/workflows/daily-fiber-sensor-monitor.yml` runs daily on a cron
schedule (and on manual dispatch): it installs dependencies, runs the pipeline,
and commits any changes with a Conventional-Commit message. Provide
`ANTHROPIC_API_KEY` as a repository secret to enable automated analysis.

## 7. Notes on this environment

The initial digest (2026-07-23) was produced in a **restricted-network**
session where the arXiv/Crossref APIs were not directly reachable. Papers were
therefore discovered via web search and are **real, recent (2026) arXiv
preprints** with genuine titles, IDs, DOIs and abstracts; author/affiliation/
country fields are left for the pipeline to auto-enrich on the first open-network
run (e.g. in GitHub Actions). Every preprint is clearly labelled as such.
