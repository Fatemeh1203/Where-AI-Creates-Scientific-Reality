"""
Central configuration for the Optical Fiber Sensors daily research monitor.

All tunable knobs live here so the rest of the pipeline stays declarative.
Nothing in this module performs I/O or network calls.
"""
from __future__ import annotations

import os
from pathlib import Path

# --------------------------------------------------------------------------- #
# Paths
# --------------------------------------------------------------------------- #
# Scripts/ lives one level below the repository root.
ROOT = Path(__file__).resolve().parent.parent

DATABASE_DIR = ROOT / "Database"
REPORTS_DIR = ROOT / "Reports"
ANALYSIS_DIR = ROOT / "Analysis"
FIGURES_DIR = ROOT / "Figures"
DOCS_DIR = ROOT / "docs"
LOGS_DIR = ROOT / "logs"

# `papers.json` is the single source of truth (kept at the repo root as per the
# project layout). `papers.csv` is a flattened, spreadsheet-friendly view that
# is regenerated from the JSON on every run.
PAPERS_JSON = ROOT / "papers.json"
PAPERS_CSV = DATABASE_DIR / "papers.csv"

README = ROOT / "README.md"

# Markers delimiting the auto-generated block inside README.md so the updater
# only ever rewrites its own section and never touches hand-written content.
README_START = "<!-- FIBER-MONITOR:START -->"
README_END = "<!-- FIBER-MONITOR:END -->"

# --------------------------------------------------------------------------- #
# Search space
# --------------------------------------------------------------------------- #
# Every sub-topic we monitor. The value is a tuple of query aliases that are
# OR-ed together when building a source query.
SEARCH_TOPICS: dict[str, tuple[str, ...]] = {
    "Optical Fiber Sensors": ("optical fiber sensor", "fiber optic sensor"),
    "Fiber Bragg Grating (FBG)": ("fiber Bragg grating", "FBG sensor"),
    "Distributed Fiber Optic Sensing (DFOS)": (
        "distributed fiber optic sensing",
        "distributed optical fiber sensor",
        "DFOS",
    ),
    "Distributed Acoustic Sensing (DAS)": ("distributed acoustic sensing", "DAS fiber"),
    "Distributed Temperature Sensing (DTS)": ("distributed temperature sensing",),
    "Distributed Strain Sensing (DSS)": ("distributed strain sensing",),
    "Interferometric Fiber Sensors": (
        "interferometric fiber sensor",
        "Fabry-Perot fiber sensor",
        "Mach-Zehnder fiber sensor",
    ),
    "Fiber Laser Sensors": ("fiber laser sensor",),
    "SPR Fiber Sensors": ("surface plasmon resonance fiber sensor", "SPR fiber"),
    "Optical / Biomedical Fiber Biosensors": (
        "optical fiber biosensor",
        "biomedical fiber sensor",
    ),
    "Fiber Optic Chemical / Gas Sensors": (
        "fiber optic chemical sensor",
        "fiber optic gas sensor",
    ),
    "Fiber Optic Physical Sensors": (
        "fiber optic pressure sensor",
        "fiber optic temperature sensor",
        "fiber optic humidity sensor",
    ),
    "Structural Health Monitoring": ("fiber optic structural health monitoring",),
    "Photonic / Silicon-Photonics Sensors": (
        "photonic sensor",
        "silicon photonics sensor",
    ),
    "Quantum Fiber Sensors": ("quantum fiber sensor", "quantum photonic sensing"),
}

# Reputable sources only. arXiv is the one with a fully open programmatic API and
# is always flagged as a preprint. Crossref is used to enrich DOI metadata and to
# reach the publisher venues (IEEE, Springer, Nature, Elsevier/ScienceDirect,
# Optica, Wiley, Taylor & Francis, MDPI, ACS, SPIE).
TRUSTED_PUBLISHERS = (
    "IEEE",
    "Springer",
    "Nature",
    "Elsevier",
    "ScienceDirect",
    "Optica",
    "OSA",
    "Wiley",
    "Taylor & Francis",
    "MDPI",
    "ACS",
    "SPIE",
)

# --------------------------------------------------------------------------- #
# Selection criteria
# --------------------------------------------------------------------------- #
RECENT_WINDOW_DAYS = 7          # strong preference for the last 7 days
FALLBACK_WINDOW_DAYS = 45       # widen if a quiet week yields too little
MAX_RESULTS_PER_TOPIC = 15      # per-topic fetch cap before dedup/ranking
MAX_PAPERS_PER_DAY = 12         # keep the daily digest focused

# Ranking weights (higher = surfaced first).
RANK_WEIGHTS = {
    "recency": 3.0,     # published within RECENT_WINDOW_DAYS
    "review": 2.0,      # survey / review articles
    "q1": 2.0,          # Q1 journal
    "highly_cited": 2.0,
    "novelty": 1.5,     # heuristic keyword hits (novel, first, breakthrough...)
}

NOVELTY_HINTS = (
    "novel",
    "first",
    "breakthrough",
    "record",
    "unprecedented",
    "state-of-the-art",
    "outperform",
    "enhanced",
)

# --------------------------------------------------------------------------- #
# Optional LLM enrichment
# --------------------------------------------------------------------------- #
# When ANTHROPIC_API_KEY is present the analyzer produces the full bilingual
# analysis automatically; otherwise it falls back to a deterministic template
# that a human analyst completes. See Scripts/analyze.py.
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
ANTHROPIC_MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-opus-4-8")

# arXiv API endpoint (Atom). Rate-limited politely by the fetcher.
ARXIV_API = "http://export.arxiv.org/api/query"
CROSSREF_API = "https://api.crossref.org/works"
USER_AGENT = "OpticalFiberSensorMonitor/1.0 (mailto:f.shams.apg@gmail.com)"


def ensure_dirs() -> None:
    """Create every output directory the pipeline writes to."""
    for d in (DATABASE_DIR, REPORTS_DIR, ANALYSIS_DIR, FIGURES_DIR, DOCS_DIR, LOGS_DIR):
        d.mkdir(parents=True, exist_ok=True)
