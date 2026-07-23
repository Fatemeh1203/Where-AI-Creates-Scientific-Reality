"""
Persistence layer.

``papers.json`` (repo root) is the source of truth — a list of full paper
records including the bilingual analysis. ``Database/papers.csv`` is a flat view
regenerated from the JSON on every save so the two never drift.

pandas is used when available for a clean CSV; a csv-module fallback keeps the
pipeline working in minimal environments.
"""
from __future__ import annotations

import json
from typing import Any

from config import PAPERS_CSV, PAPERS_JSON, ensure_dirs
from logging_setup import get_logger

log = get_logger()

# Columns required by the project spec, in order.
CSV_COLUMNS = [
    "Date",
    "Title",
    "Authors",
    "Country",
    "Journal",
    "Publisher",
    "DOI",
    "Link",
    "Google Scholar",
    "Keywords",
    "Open Access",
    "Summary",
    "Research Area",
    "Rating",
    "Notes",
]


def load_papers() -> list[dict]:
    if not PAPERS_JSON.exists():
        return []
    try:
        with PAPERS_JSON.open(encoding="utf-8") as fh:
            data = json.load(fh)
        return data.get("papers", data) if isinstance(data, dict) else data
    except (json.JSONDecodeError, OSError) as exc:
        log.error("Could not read %s: %s", PAPERS_JSON, exc)
        return []


def _stars(rating: Any) -> str:
    try:
        n = int(rating)
    except (TypeError, ValueError):
        return ""
    return "★" * n + "☆" * (5 - n)


def _csv_row(p: dict) -> dict[str, str]:
    kw = p.get("keywords", [])
    kw_str = "; ".join(kw) if isinstance(kw, list) else str(kw)
    summary = p.get("summary_en") or p.get("abstract") or ""
    summary = summary.strip().replace("\n", " ")
    if len(summary) > 400:
        summary = summary[:397] + "..."
    return {
        "Date": p.get("date_added", p.get("published", "")),
        "Title": p.get("title_en", ""),
        "Authors": p.get("authors", ""),
        "Country": p.get("country", ""),
        "Journal": p.get("journal", ""),
        "Publisher": p.get("publisher", ""),
        "DOI": p.get("doi", ""),
        "Link": p.get("link", ""),
        "Google Scholar": p.get("scholar", ""),
        "Keywords": kw_str,
        "Open Access": p.get("open_access", ""),
        "Summary": summary,
        "Research Area": p.get("research_area", ""),
        "Rating": _stars(p.get("rating")),
        "Notes": p.get("notes", "Preprint" if p.get("is_preprint") else ""),
    }


def save_papers(papers: list[dict]) -> None:
    """Persist the full JSON and regenerate the flat CSV."""
    ensure_dirs()
    payload = {
        "generated_by": "Optical Fiber Sensors Daily Research Monitor",
        "count": len(papers),
        "papers": papers,
    }
    with PAPERS_JSON.open("w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)
    log.info("Wrote %d records to %s", len(papers), PAPERS_JSON)

    rows = [_csv_row(p) for p in papers]
    _write_csv(rows)


def _write_csv(rows: list[dict]) -> None:
    try:
        import pandas as pd  # noqa: WPS433 (optional dependency)

        pd.DataFrame(rows, columns=CSV_COLUMNS).to_csv(
            PAPERS_CSV, index=False, encoding="utf-8"
        )
    except ImportError:
        import csv

        with PAPERS_CSV.open("w", encoding="utf-8", newline="") as fh:
            writer = csv.DictWriter(fh, fieldnames=CSV_COLUMNS)
            writer.writeheader()
            writer.writerows(rows)
    log.info("Wrote %d rows to %s", len(rows), PAPERS_CSV)


def papers_for_date(papers: list[dict], day: str) -> list[dict]:
    return [p for p in papers if p.get("date_added") == day]
