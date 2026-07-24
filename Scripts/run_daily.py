"""
Orchestrator — the single entry point for the daily run.

Pipeline:
    1. load existing database (history)
    2. fetch candidates from every topic across the trusted sources
    3. de-duplicate against history + within the batch
    4. rank, cap to MAX_PAPERS_PER_DAY
    5. analyse (LLM or template) → bilingual analysis + rating
    6. persist (papers.json + Database/papers.csv)
    7. write the daily report, figures, refresh README

Design principle: **never abort the whole run on one failure.** Each stage is
wrapped so an error is logged and the pipeline continues with what it has.

Usage:
    python Scripts/run_daily.py                 # full fetch + analyse
    python Scripts/run_daily.py --regenerate    # rebuild CSV/report/README/figures
                                                # from the existing papers.json only
"""
from __future__ import annotations

import argparse
from datetime import date, datetime

from analyze import analyze
from config import (
    FALLBACK_WINDOW_DAYS,
    MAX_PAPERS_PER_DAY,
    RANK_WEIGHTS,
    RECENT_WINDOW_DAYS,
    SEARCH_TOPICS,
    ensure_dirs,
)
from database import load_papers, papers_for_date, save_papers
from dedupe import dedupe_batch
from figures import write_figures
from logging_setup import get_logger
from readme_updater import update_readme
from report import write_report
from sources import fetch_arxiv, fetch_crossref

log = get_logger()


def _days_old(published: str) -> int:
    try:
        d = datetime.strptime(published[:10], "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return 10_000
    return (date.today() - d).days


def rank_score(p: dict) -> float:
    score = 0.0
    age = _days_old(p.get("published", ""))
    if age <= RECENT_WINDOW_DAYS:
        score += RANK_WEIGHTS["recency"]
    elif age <= FALLBACK_WINDOW_DAYS:
        score += RANK_WEIGHTS["recency"] * 0.5
    if p.get("is_review"):
        score += RANK_WEIGHTS["review"]
    if (p.get("quartile") or "").upper() == "Q1":
        score += RANK_WEIGHTS["q1"]
    if (p.get("citations") or 0) >= 20:
        score += RANK_WEIGHTS["highly_cited"]
    if p.get("rating"):
        score += float(p["rating"]) * 0.3
    return score


def collect_candidates() -> list[dict]:
    candidates: list[dict] = []
    for area, aliases in SEARCH_TOPICS.items():
        query = " OR ".join(f'"{a}"' for a in aliases)
        for fetch in (fetch_arxiv, fetch_crossref):
            try:
                for rec in fetch(query):
                    rec["research_area"] = area
                    candidates.append(rec)
            except Exception as exc:  # pragma: no cover
                log.error("Source %s failed for %s: %s", fetch.__name__, area, exc)
    log.info("Collected %d raw candidates", len(candidates))
    return candidates


def default_trends(day_papers: list[dict]) -> dict:
    """Deterministic fallback trend text when no LLM narrative is supplied."""
    n = len(day_papers)
    areas = sorted({p.get("research_area", "") for p in day_papers})
    return {
        "day_summary_en": f"{n} new paper(s) logged today across {len(areas)} research area(s).",
        "day_summary_fa": f"امروز {n} مقاله جدید در {len(areas)} حوزه پژوهشی ثبت شد.",
        "trends_md": "\n".join(f"- {a}" for a in areas) or "- —",
        "tech_trend_en": "See per-paper analysis below.",
        "tech_trend_fa": "به تحلیل هر مقاله در ادامه مراجعه کنید.",
        "suggestions_md": "- Continue monitoring the highest-rated directions.",
    }


def run(regenerate: bool = False) -> None:
    ensure_dirs()
    today = date.today().isoformat()
    history = load_papers()
    log.info("Loaded %d existing records", len(history))

    if not regenerate:
        candidates = collect_candidates()
        fresh = dedupe_batch(candidates, history)
        log.info("%d fresh after dedup", len(fresh))
        fresh.sort(key=rank_score, reverse=True)
        selected = fresh[:MAX_PAPERS_PER_DAY]
        for rec in selected:
            try:
                analyze(rec)
            except Exception as exc:  # pragma: no cover
                log.error("Analysis failed for %s: %s", rec.get("id"), exc)
            rec.setdefault("date_added", today)
        history = history + selected
        save_papers(history)

    # (Re)build all derived artefacts from the database.
    day_papers = papers_for_date(history, today) or history[-MAX_PAPERS_PER_DAY:]
    trends = default_trends(day_papers)
    try:
        write_report(day_papers, trends, today)
    except Exception as exc:  # pragma: no cover
        log.error("Report generation failed: %s", exc)
    try:
        write_figures(history)
    except Exception as exc:  # pragma: no cover
        log.error("Figure generation failed: %s", exc)
    try:
        update_readme(history)
    except Exception as exc:  # pragma: no cover
        log.error("README update failed: %s", exc)

    log.info("Daily run complete: %d total records", len(history))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Optical Fiber Sensors daily monitor")
    parser.add_argument(
        "--regenerate",
        action="store_true",
        help="Rebuild CSV/report/figures/README from the existing papers.json only",
    )
    args = parser.parse_args()
    run(regenerate=args.regenerate)
