"""
Source fetchers for reputable scientific venues.

Only two programmatic endpoints are hit directly:

* **arXiv** (Atom API) — always tagged ``is_preprint=True`` and labelled as a
  preprint everywhere downstream.
* **Crossref** — used to enrich DOIs and to reach the published-venue metadata
  (IEEE / Springer / Nature / Elsevier / Optica / Wiley / T&F / MDPI / ACS /
  SPIE).

Both fetchers degrade gracefully: on any network / parse error they log and
return an empty list so the daily run continues.

Records are normalised to a common dict shape consumed by the rest of the
pipeline (see ``normalize`` docstring).
"""
from __future__ import annotations

import time
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from typing import Any
from urllib.parse import quote_plus

import requests

from config import (
    ARXIV_API,
    CROSSREF_API,
    MAX_RESULTS_PER_TOPIC,
    TRUSTED_PUBLISHERS,
    USER_AGENT,
)
from logging_setup import get_logger

log = get_logger()

_ATOM = "{http://www.w3.org/2005/Atom}"
_ARXIV_NS = "{http://arxiv.org/schemas/atom}"


def _scholar_link(title: str) -> str:
    return f"https://scholar.google.com/scholar?q={quote_plus(title)}"


def normalize(**kwargs: Any) -> dict[str, Any]:
    """Return a record with every field the pipeline expects, defaulted."""
    base: dict[str, Any] = {
        "id": "",
        "title_en": "",
        "title_fa": "",
        "authors": "",
        "affiliation": "",
        "country": "",
        "journal": "",
        "publisher": "",
        "doi": "",
        "link": "",
        "scholar": "",
        "open_access": "Unknown",
        "citations": None,
        "impact_factor": None,
        "quartile": None,
        "keywords": [],
        "research_area": "",
        "published": "",
        "is_preprint": False,
        "is_review": False,
        "abstract": "",
    }
    base.update(kwargs)
    if base["title_en"] and not base["scholar"]:
        base["scholar"] = _scholar_link(base["title_en"])
    return base


# --------------------------------------------------------------------------- #
# arXiv
# --------------------------------------------------------------------------- #
def fetch_arxiv(query: str, max_results: int = MAX_RESULTS_PER_TOPIC) -> list[dict]:
    """Query the arXiv Atom API for the most recent submissions matching ``query``."""
    params = {
        "search_query": f"all:{query}",
        "start": 0,
        "max_results": max_results,
        "sortBy": "submittedDate",
        "sortOrder": "descending",
    }
    try:
        resp = requests.get(
            ARXIV_API,
            params=params,
            headers={"User-Agent": USER_AGENT},
            timeout=40,
        )
        resp.raise_for_status()
    except requests.RequestException as exc:  # pragma: no cover - network dependent
        log.warning("arXiv fetch failed for %r: %s", query, exc)
        return []

    try:
        feed = ET.fromstring(resp.text)
    except ET.ParseError as exc:  # pragma: no cover
        log.warning("arXiv parse failed for %r: %s", query, exc)
        return []

    out: list[dict] = []
    for entry in feed.findall(f"{_ATOM}entry"):
        title = (entry.findtext(f"{_ATOM}title") or "").strip().replace("\n", " ")
        summary = (entry.findtext(f"{_ATOM}summary") or "").strip().replace("\n", " ")
        published = (entry.findtext(f"{_ATOM}published") or "")[:10]
        arxiv_url = entry.findtext(f"{_ATOM}id") or ""
        arxiv_id = arxiv_url.rsplit("/", 1)[-1]

        authors = [
            (a.findtext(f"{_ATOM}name") or "").strip()
            for a in entry.findall(f"{_ATOM}author")
        ]
        doi = entry.findtext(f"{_ARXIV_NS}doi") or f"10.48550/arXiv.{arxiv_id.split('v')[0]}"
        categories = [
            c.attrib.get("term", "") for c in entry.findall(f"{_ATOM}category")
        ]

        out.append(
            normalize(
                id=f"arXiv:{arxiv_id}",
                title_en=title,
                authors=", ".join(a for a in authors if a),
                journal="arXiv (preprint)",
                publisher="arXiv",
                doi=doi,
                link=arxiv_url,
                open_access="Yes (preprint)",
                keywords=categories,
                published=published,
                is_preprint=True,
                is_review="review" in title.lower() or "survey" in title.lower(),
                abstract=summary,
            )
        )
    log.info("arXiv: %d results for %r", len(out), query)
    time.sleep(3)  # be polite to the arXiv API
    return out


# --------------------------------------------------------------------------- #
# Crossref (published-venue enrichment)
# --------------------------------------------------------------------------- #
def fetch_crossref(query: str, rows: int = MAX_RESULTS_PER_TOPIC) -> list[dict]:
    """Query Crossref for recently published, peer-reviewed articles."""
    params = {
        "query.bibliographic": query,
        "rows": rows,
        "sort": "published",
        "order": "desc",
        "filter": "type:journal-article",
        "select": "DOI,title,author,container-title,publisher,published,subject,is-referenced-by-count,URL",
    }
    try:
        resp = requests.get(
            CROSSREF_API,
            params=params,
            headers={"User-Agent": USER_AGENT},
            timeout=40,
        )
        resp.raise_for_status()
        items = resp.json().get("message", {}).get("items", [])
    except (requests.RequestException, ValueError) as exc:  # pragma: no cover
        log.warning("Crossref fetch failed for %r: %s", query, exc)
        return []

    out: list[dict] = []
    for it in items:
        publisher = it.get("publisher", "")
        # Keep only reputable venues.
        if not any(p.lower() in publisher.lower() for p in TRUSTED_PUBLISHERS):
            continue
        title = " ".join(it.get("title", []) or []).strip()
        if not title:
            continue
        authors = ", ".join(
            f"{a.get('given', '')} {a.get('family', '')}".strip()
            for a in it.get("author", []) or []
        )
        parts = (it.get("published", {}).get("date-parts") or [[None]])[0]
        published = "-".join(f"{p:02d}" if isinstance(p, int) else str(p) for p in parts if p)
        out.append(
            normalize(
                id=f"doi:{it.get('DOI', '')}",
                title_en=title,
                authors=authors,
                journal=" ".join(it.get("container-title", []) or []),
                publisher=publisher,
                doi=it.get("DOI", ""),
                link=it.get("URL", ""),
                open_access="Unknown",
                citations=it.get("is-referenced-by-count"),
                keywords=it.get("subject", []) or [],
                published=published,
                is_review="review" in title.lower() or "survey" in title.lower(),
            )
        )
    log.info("Crossref: %d trusted-venue results for %r", len(out), query)
    time.sleep(1)
    return out


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
