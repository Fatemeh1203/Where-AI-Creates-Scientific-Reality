# Scripts — Optical Fiber Sensors Daily Research Monitor

Modular Python 3.12 pipeline (works on 3.11+). See
[`../docs/RESEARCH_MONITOR.md`](../docs/RESEARCH_MONITOR.md) for the full design.

## Quick start

```bash
python -m pip install -r requirements.txt
python run_daily.py              # fetch + analyse + report (needs open network)
python run_daily.py --regenerate # rebuild artefacts from papers.json only
```

## Modules

- `config.py` — topics, sources, criteria, paths.
- `logging_setup.py` — shared logger.
- `sources.py` — arXiv + Crossref fetchers (graceful failure).
- `dedupe.py` — duplicate detection.
- `analyze.py` — bilingual analysis + rating (LLM or template).
- `database.py` — `papers.json` ↔ `Database/papers.csv`.
- `report.py` — daily bilingual report.
- `figures.py` — SVG/PNG charts.
- `readme_updater.py` — README stats block.
- `run_daily.py` — orchestrator (entry point).

## Environment variables

| Var | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Enable automated bilingual analysis via the Claude API. |
| `ANTHROPIC_MODEL` | Override the analysis model (default `claude-opus-4-8`). |

## Design guarantees

- **No duplicates** — every candidate is checked against the full history.
- **Fail-soft** — a single source/analysis error is logged; the run continues.
- **Deterministic artefacts** — CSV, report, figures and README are always
  regenerated from `papers.json`, so they never drift.
