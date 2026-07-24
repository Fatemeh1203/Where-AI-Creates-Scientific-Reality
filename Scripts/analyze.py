"""
Analysis stage.

Turns a raw source record into a full bilingual (English + Persian) analysis:
summary, research problem, innovation, method, key results, limitations,
applications, reading recommendation and a 1–5 star rating.

Two modes:

* **LLM mode** — when ``ANTHROPIC_API_KEY`` is set, the abstract is sent to the
  Claude Messages API which returns a structured JSON analysis. This is what the
  scheduled GitHub Action uses.
* **Template mode** — otherwise a deterministic skeleton is returned with the
  raw abstract preserved, ready for a human analyst to complete. This keeps the
  pipeline runnable offline and in restricted-network environments.

The rating heuristic (used to seed the LLM and as the template default) rewards
recency, review articles, Q1 venues, high citation counts and novelty cues.
"""
from __future__ import annotations

import json
from datetime import date, datetime

from config import (
    ANTHROPIC_API_KEY,
    ANTHROPIC_MODEL,
    NOVELTY_HINTS,
    RECENT_WINDOW_DAYS,
)
from logging_setup import get_logger

log = get_logger()

ANALYSIS_FIELDS = (
    "summary_en",
    "summary_fa",
    "problem_en",
    "problem_fa",
    "innovation_en",
    "innovation_fa",
    "method_en",
    "method_fa",
    "results_en",
    "results_fa",
    "limitations_en",
    "limitations_fa",
    "applications_en",
    "applications_fa",
    "recommendation_en",
    "recommendation_fa",
    "rating_reason_en",
    "rating_reason_fa",
)


def heuristic_rating(record: dict) -> int:
    """A defensible 1–5 seed rating from metadata alone."""
    score = 2.0
    text = f"{record.get('title_en', '')} {record.get('abstract', '')}".lower()

    if _is_recent(record.get("published", "")):
        score += 1.0
    if record.get("is_review"):
        score += 0.5
    if (record.get("quartile") or "").upper() == "Q1":
        score += 0.5
    if (record.get("citations") or 0) >= 20:
        score += 0.5
    if any(h in text for h in NOVELTY_HINTS):
        score += 0.5
    return max(1, min(5, round(score)))


def _is_recent(published: str) -> bool:
    try:
        d = datetime.strptime(published[:10], "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return False
    return (date.today() - d).days <= RECENT_WINDOW_DAYS


def analyze(record: dict) -> dict:
    """Return ``record`` enriched with the analysis fields."""
    record.setdefault("rating", heuristic_rating(record))
    if ANTHROPIC_API_KEY:
        try:
            return _analyze_with_llm(record)
        except Exception as exc:  # pragma: no cover - network dependent
            log.error("LLM analysis failed (%s); falling back to template", exc)
    return _analyze_template(record)


def _analyze_template(record: dict) -> dict:
    abstract = record.get("abstract", "").strip()
    todo_en = "[To be completed by analyst]"
    todo_fa = "[برای تکمیل توسط تحلیل‌گر]"
    for f in ANALYSIS_FIELDS:
        record.setdefault(f, todo_fa if f.endswith("_fa") else todo_en)
    if abstract and record.get("summary_en") == todo_en:
        record["summary_en"] = abstract
    return record


def _analyze_with_llm(record: dict) -> dict:
    import anthropic  # optional dependency

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    prompt = (
        "You are a senior optical-fiber-sensors research analyst. "
        "Given the paper metadata and abstract below, return ONLY a JSON object "
        "with these keys (bilingual English + Persian): "
        f"{', '.join(ANALYSIS_FIELDS)}, and an integer 'rating' 1-5. "
        "Each summary must be 200-300 words and go beyond translating the abstract "
        "(add context, significance, critique). Persian ('_fa') fields must be fluent "
        "native Persian, not machine translation.\n\n"
        f"TITLE: {record.get('title_en')}\n"
        f"VENUE: {record.get('journal')} ({record.get('publisher')})\n"
        f"KEYWORDS: {record.get('keywords')}\n"
        f"ABSTRACT: {record.get('abstract')}\n"
    )
    msg = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}],
    )
    text = "".join(block.text for block in msg.content if block.type == "text")
    text = text[text.find("{") : text.rfind("}") + 1]
    data = json.loads(text)
    record.update(data)
    return record
