"""Duplicate detection.

A paper is considered already known if any of the following matches an existing
record: normalised DOI, arXiv id, or a normalised title. This prevents the same
work from being logged twice even when it surfaces under several topics or moves
from preprint to published version.
"""
from __future__ import annotations

import re

_WS = re.compile(r"\s+")
_NONWORD = re.compile(r"[^a-z0-9 ]+")


def norm_title(title: str) -> str:
    t = (title or "").lower()
    t = _NONWORD.sub(" ", t)
    t = _WS.sub(" ", t).strip()
    return t


def norm_doi(doi: str) -> str:
    d = (doi or "").lower().strip()
    d = d.replace("https://doi.org/", "").replace("http://dx.doi.org/", "")
    return d


def index_existing(records: list[dict]) -> tuple[set, set]:
    """Return (known_dois, known_titles) built from the current database."""
    dois: set[str] = set()
    titles: set[str] = set()
    for r in records:
        if r.get("doi"):
            dois.add(norm_doi(r["doi"]))
        if r.get("id"):
            dois.add(norm_doi(r["id"]))
        if r.get("title_en"):
            titles.add(norm_title(r["title_en"]))
    return dois, titles


def is_duplicate(record: dict, known_dois: set, known_titles: set) -> bool:
    if record.get("doi") and norm_doi(record["doi"]) in known_dois:
        return True
    if record.get("id") and norm_doi(record["id"]) in known_dois:
        return True
    if record.get("title_en") and norm_title(record["title_en"]) in known_titles:
        return True
    return False


def dedupe_batch(candidates: list[dict], existing: list[dict]) -> list[dict]:
    """Return only candidates not present in ``existing`` and not repeated within the batch."""
    known_dois, known_titles = index_existing(existing)
    fresh: list[dict] = []
    for c in candidates:
        if is_duplicate(c, known_dois, known_titles):
            continue
        fresh.append(c)
        # extend the "known" sets so intra-batch duplicates are also caught
        if c.get("doi"):
            known_dois.add(norm_doi(c["doi"]))
        if c.get("title_en"):
            known_titles.add(norm_title(c["title_en"]))
    return fresh
