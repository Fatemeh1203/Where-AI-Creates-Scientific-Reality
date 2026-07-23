"""
Daily report generator.

Writes ``Reports/YYYY-MM-DD.md`` — a bilingual (EN/FA) digest containing the
day summary, top research trends, per-paper analysis, a technology-trend note,
a comparison with the previous day and forward-looking research suggestions.

Everything is derived from the day's records in the database, so the report is
always consistent with ``papers.json`` / ``papers.csv``.
"""
from __future__ import annotations

from collections import Counter
from datetime import date

from config import REPORTS_DIR, ensure_dirs
from logging_setup import get_logger

log = get_logger()

STAR = "★"
STAR_EMPTY = "☆"


def _stars(n) -> str:
    try:
        n = int(n)
    except (TypeError, ValueError):
        return ""
    return STAR * n + STAR_EMPTY * (5 - n)


def _prev_report_count() -> tuple[str | None, int]:
    """Return (previous_report_date, paper_count) if a prior report exists."""
    if not REPORTS_DIR.exists():
        return None, 0
    reports = sorted(p.stem for p in REPORTS_DIR.glob("*.md"))
    today = date.today().isoformat()
    prior = [r for r in reports if r < today]
    if not prior:
        return None, 0
    prev = prior[-1]
    text = (REPORTS_DIR / f"{prev}.md").read_text(encoding="utf-8")
    # count analysed papers by the per-paper heading marker
    count = text.count("### ")
    return prev, count


def _paper_block(i: int, p: dict) -> str:
    kw = ", ".join(p.get("keywords", [])) if isinstance(p.get("keywords"), list) else p.get("keywords", "")
    preprint = " · **Preprint**" if p.get("is_preprint") else ""
    lines = [
        f"### {i}. {p.get('title_en','')}",
        f"**عنوان (فارسی):** {p.get('title_fa','')}",
        "",
        f"- **Authors / نویسندگان:** {p.get('authors') or '—'}",
        f"- **Affiliation / وابستگی:** {p.get('affiliation') or '—'}"
        f" · **Country / کشور:** {p.get('country') or '—'}",
        f"- **Venue / منبع:** {p.get('journal','')} — {p.get('publisher','')}{preprint}",
        f"- **Published / انتشار:** {p.get('published','—')}"
        f" · **DOI:** `{p.get('doi','—')}`",
        f"- **Link:** {p.get('link','—')} · "
        f"**Scholar:** [search]({p.get('scholar','')})",
        f"- **Open Access:** {p.get('open_access','—')}"
        f" · **Citations:** {p.get('citations') if p.get('citations') is not None else '—'}"
        f" · **IF:** {p.get('impact_factor') or '—'}"
        f" · **Quartile:** {p.get('quartile') or '—'}",
        f"- **Research Area / حوزه:** {p.get('research_area','')}",
        f"- **Keywords / کلیدواژه‌ها:** {kw}",
        f"- **Rating / امتیاز:** {_stars(p.get('rating'))} ({p.get('rating')}/5)",
        "",
        "#### 📝 Summary / خلاصه",
        p.get("summary_en", ""),
        "",
        f"> {p.get('summary_fa','')}",
        "",
        "| Aspect / جنبه | English | فارسی |",
        "|---|---|---|",
        f"| Research problem / مسئله | {_c(p.get('problem_en'))} | {_c(p.get('problem_fa'))} |",
        f"| Innovation / نوآوری | {_c(p.get('innovation_en'))} | {_c(p.get('innovation_fa'))} |",
        f"| Method / روش | {_c(p.get('method_en'))} | {_c(p.get('method_fa'))} |",
        f"| Key results / نتایج | {_c(p.get('results_en'))} | {_c(p.get('results_fa'))} |",
        f"| Limitations / محدودیت‌ها | {_c(p.get('limitations_en'))} | {_c(p.get('limitations_fa'))} |",
        f"| Applications / کاربردها | {_c(p.get('applications_en'))} | {_c(p.get('applications_fa'))} |",
        f"| Read it? / پیشنهاد مطالعه | {_c(p.get('recommendation_en'))} | {_c(p.get('recommendation_fa'))} |",
        "",
        f"**Why this rating / دلیل امتیاز:** {p.get('rating_reason_en','')} — {p.get('rating_reason_fa','')}",
        "",
        "---",
        "",
    ]
    return "\n".join(lines)


def _c(v) -> str:
    """Cell-safe: strip newlines and escape pipes for markdown tables."""
    return (v or "—").replace("\n", " ").replace("|", "\\|")


def build_report(day_papers: list[dict], trends: dict, day: str | None = None) -> str:
    day = day or date.today().isoformat()
    areas = Counter(p.get("research_area", "—") for p in day_papers)
    prev_date, prev_count = _prev_report_count()

    hot = ", ".join(f"{a} ({n})" for a, n in areas.most_common(5)) or "—"
    avg_rating = (
        round(sum(int(p.get("rating", 0)) for p in day_papers) / len(day_papers), 2)
        if day_papers
        else 0
    )

    header = [
        f"# 🔬 Optical Fiber Sensors — Daily Research Report",
        f"# 🔬 گزارش روزانه پژوهش سنسورهای فیبر نوری",
        "",
        f"**Date / تاریخ:** {day}  ",
        f"**Papers today / مقالات امروز:** {len(day_papers)}  ",
        f"**Average rating / میانگین امتیاز:** {avg_rating} / 5  ",
        f"**Hot areas / حوزه‌های داغ:** {hot}",
        "",
        "---",
        "",
        "## 🗒️ Day summary / خلاصه روز",
        "",
        f"**EN —** {trends.get('day_summary_en','')}",
        "",
        f"**FA —** {trends.get('day_summary_fa','')}",
        "",
        "## 📈 Top research trends / مهم‌ترین روندهای تحقیقاتی",
        "",
        trends.get("trends_md", "- —"),
        "",
        "## 🧪 Technology-trend analysis / تحلیل روند فناوری",
        "",
        f"**EN —** {trends.get('tech_trend_en','')}",
        "",
        f"**FA —** {trends.get('tech_trend_fa','')}",
        "",
        "## 🔁 Comparison with previous day / مقایسه با روز قبل",
        "",
        (
            f"- Previous report / گزارش قبلی: **{prev_date}** with {prev_count} analysed papers.\n"
            f"- Change / تغییر: **{len(day_papers) - prev_count:+d}** papers vs. the previous report."
            if prev_date
            else "- This is the first report in the series / این نخستین گزارش مجموعه است."
        ),
        "",
        "## 🧭 Future research suggestions / پیشنهادهای تحقیقاتی آینده",
        "",
        trends.get("suggestions_md", "- —"),
        "",
        "---",
        "",
        f"## 📚 New papers / مقالات جدید ({len(day_papers)})",
        "",
    ]

    body = "".join(_paper_block(i, p) for i, p in enumerate(day_papers, 1))

    footer = [
        "## ℹ️ Sources & method / منابع و روش",
        "",
        "Papers are collected from reputable venues only (IEEE, Springer, Nature, "
        "ScienceDirect/Elsevier, Optica, Wiley, Taylor & Francis, MDPI, ACS, SPIE, "
        "and arXiv preprints — the latter always flagged as *Preprint*). "
        "Duplicates are filtered against the full history in `../papers.json`.",
        "",
        "مقالات فقط از منابع معتبر گردآوری می‌شوند و پیش‌چاپ‌های arXiv همیشه با برچسب "
        "«Preprint» مشخص شده‌اند. رکوردهای تکراری در برابر کل تاریخچه فیلتر می‌شوند.",
        "",
    ]

    return "\n".join(header) + body + "\n".join(footer) + "\n"


def write_report(day_papers: list[dict], trends: dict, day: str | None = None) -> str:
    ensure_dirs()
    day = day or date.today().isoformat()
    content = build_report(day_papers, trends, day)
    path = REPORTS_DIR / f"{day}.md"
    path.write_text(content, encoding="utf-8")
    log.info("Wrote report %s (%d papers)", path, len(day_papers))
    return str(path)
