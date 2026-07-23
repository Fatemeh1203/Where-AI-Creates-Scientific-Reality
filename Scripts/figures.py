"""
Figure generation.

Produces a self-contained SVG bar chart of paper counts per research area (no
matplotlib dependency, so it runs anywhere). If matplotlib *is* installed a PNG
is written too. Output goes to ``Figures/``.
"""
from __future__ import annotations

from collections import Counter

from config import FIGURES_DIR, ensure_dirs
from logging_setup import get_logger

log = get_logger()

_PALETTE = ["#2a9d8f", "#264653", "#e9c46a", "#f4a261", "#e76f51", "#8ab17d", "#457b9d"]


def _esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def area_bar_svg(papers: list[dict]) -> str:
    counts = Counter(p.get("research_area", "—") for p in papers)
    items = counts.most_common()
    if not items:
        items = [("No data", 0)]
    width, row_h, pad_left, pad_top = 720, 34, 260, 50
    height = pad_top + row_h * len(items) + 30
    max_n = max(n for _, n in items) or 1
    bar_max = width - pad_left - 60

    rows = []
    for i, (area, n) in enumerate(items):
        y = pad_top + i * row_h
        bar_w = max(3, int(bar_max * n / max_n))
        color = _PALETTE[i % len(_PALETTE)]
        rows.append(
            f'<text x="{pad_left-10}" y="{y+16}" text-anchor="end" '
            f'font-size="13" fill="#333">{_esc(area)[:38]}</text>'
            f'<rect x="{pad_left}" y="{y+3}" width="{bar_w}" height="20" '
            f'rx="4" fill="{color}"/>'
            f'<text x="{pad_left+bar_w+8}" y="{y+18}" font-size="13" '
            f'fill="#333">{n}</text>'
        )

    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}" font-family="system-ui,Segoe UI,Arial">'
        f'<rect width="{width}" height="{height}" fill="#ffffff"/>'
        f'<text x="20" y="30" font-size="18" font-weight="700" fill="#264653">'
        f'Optical Fiber Sensors — papers by research area</text>'
        + "".join(rows)
        + "</svg>"
    )


def write_figures(papers: list[dict]) -> list[str]:
    ensure_dirs()
    written = []
    svg = area_bar_svg(papers)
    svg_path = FIGURES_DIR / "papers_by_area.svg"
    svg_path.write_text(svg, encoding="utf-8")
    written.append(str(svg_path))

    try:  # optional PNG
        import matplotlib

        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        counts = Counter(p.get("research_area", "—") for p in papers)
        items = counts.most_common()
        if items:
            labels, vals = zip(*items)
            fig, ax = plt.subplots(figsize=(9, max(3, 0.5 * len(items))))
            ax.barh(labels, vals, color=_PALETTE[0])
            ax.invert_yaxis()
            ax.set_xlabel("Papers")
            ax.set_title("Optical Fiber Sensors — papers by research area")
            fig.tight_layout()
            png_path = FIGURES_DIR / "papers_by_area.png"
            fig.savefig(png_path, dpi=120)
            plt.close(fig)
            written.append(str(png_path))
    except ImportError:
        log.info("matplotlib not installed; SVG figure only")

    log.info("Wrote figures: %s", ", ".join(written))
    return written
