"""
README statistics updater.

Rewrites only the block delimited by the FIBER-MONITOR markers in the root
README, leaving every other (hand-written) section untouched. If the markers
are absent, the block is appended once.
"""
from __future__ import annotations

from collections import Counter
from datetime import date, datetime, timedelta

from config import README, README_END, README_START
from logging_setup import get_logger

log = get_logger()


def _this_week(papers: list[dict]) -> int:
    cutoff = date.today() - timedelta(days=7)
    n = 0
    for p in papers:
        try:
            d = datetime.strptime(p.get("date_added", "")[:10], "%Y-%m-%d").date()
        except ValueError:
            continue
        if d >= cutoff:
            n += 1
    return n


def build_block(papers: list[dict]) -> str:
    total = len(papers)
    week = _this_week(papers)
    journals = {p.get("journal", "") for p in papers if p.get("journal")}
    areas = Counter(p.get("research_area", "—") for p in papers)
    hot = areas.most_common(6)
    last_update = date.today().isoformat()

    hot_rows = "\n".join(f"| {a} | {n} |" for a, n in hot) or "| — | 0 |"

    return f"""{README_START}

## 🔬 Optical Fiber Sensors — Daily Research Monitor

An automated pipeline that every day discovers, vets, analyses (bilingual EN/FA)
and logs the newest peer-reviewed and preprint literature on optical fiber
sensing. See [`docs/RESEARCH_MONITOR.md`](docs/RESEARCH_MONITOR.md) for the design.

| Metric | Value |
|---|---|
| 🕒 Last update | **{last_update}** |
| 📚 Total papers tracked | **{total}** |
| 🗓️ Papers this week | **{week}** |
| 📰 Distinct journals/venues | **{len(journals)}** |

**🔥 Hot topics**

| Research area | Papers |
|---|---|
{hot_rows}

📈 Chart: [`Figures/papers_by_area.svg`](Figures/papers_by_area.svg) ·
🗂️ Database: [`Database/papers.csv`](Database/papers.csv) ·
📄 Latest report: [`Reports/{last_update}.md`](Reports/{last_update}.md)

{README_END}"""


def update_readme(papers: list[dict]) -> None:
    block = build_block(papers)
    if README.exists():
        text = README.read_text(encoding="utf-8")
    else:
        text = "# Repository\n"

    if README_START in text and README_END in text:
        pre = text.split(README_START)[0]
        post = text.split(README_END, 1)[1]
        text = pre + block + post
    else:
        text = text.rstrip() + "\n\n" + block + "\n"

    README.write_text(text, encoding="utf-8")
    log.info("README updated (total=%d, week=%d)", len(papers), _this_week(papers))
