"""
One-off generator for the 2026-07-23 digest.

Rebuilds every derived artefact (CSV, daily report, figures, README block) from
the hand-curated ``papers.json``, and supplies the rich bilingual trend
narrative for the day. Idempotent: safe to re-run.
"""
from __future__ import annotations

from database import load_papers, papers_for_date, save_papers
from figures import write_figures
from readme_updater import update_readme
from report import write_report

DAY = "2026-07-23"

TRENDS = {
    "day_summary_en": (
        "Six papers were logged today, and the through-line is unmistakable: distributed "
        "and quantum fiber sensing are converging with machine learning. Three of the six "
        "sit in the distributed-sensing family (DAS urban-coverage theory, a 500,000-event "
        "marine DAS deep-learning catalogue, and a transportation-infrastructure DFOS review), "
        "one pushes FBG acoustic-emission sensing onto an integrated ML-calibrated laser, one "
        "opens a quantum-sensing frontier via RF-over-fiber control of NV spins, and one offers "
        "a practical cascaded-interferometer resolution boost. Recency skews to 2026, with two "
        "June-2026 preprints leading."
    ),
    "day_summary_fa": (
        "امروز شش مقاله ثبت شد و رشته پیوند آن‌ها آشکار است: حسگری توزیع‌شده و کوانتومی فیبری "
        "در حال هم‌گرایی با یادگیری ماشین است. سه مقاله در خانواده حسگری توزیع‌شده‌اند (نظریه "
        "پوشش شهری DAS، فهرست ۵۰۰٬۰۰۰ رویدادی DAS دریایی با یادگیری عمیق، و مروری بر DFOS در "
        "زیرساخت حمل‌ونقل)، یکی حسگری گسیل آکوستیک FBG را روی لیزر مجتمع کالیبره‌شده با یادگیری "
        "ماشین می‌برد، یکی مرزی تازه در حسگری کوانتومی از راه کنترل رادیوفرکانس‌روی‌فیبر اسپین‌های "
        "NV می‌گشاید و یکی بهبود عملی تفکیک با تداخل‌سنج آبشاری ارائه می‌دهد. تازگی به سمت ۲۰۲۶ "
        "متمایل است و دو پیش‌چاپ ژوئن ۲۰۲۶ پیشتازند."
    ),
    "trends_md": (
        "1. **Distributed sensing × deep learning** — automated event catalogues from raw DAS "
        "(DASNet) and ML-in-the-loop interrogation are becoming the default, not the exception.\n"
        "2. **From devices to networks/systems** — the strongest work spans device physics to "
        "autonomous, field-deployable systems (integrated FBG interrogator; city-scale DAS planning).\n"
        "3. **Coverage & deployment theory** — percolation/coverage-threshold thinking treats "
        "urban fiber as a design problem, not just a sensor.\n"
        "4. **Quantum sensing meets fiber** — RF-over-fiber control brings spin-qubit sensors "
        "toward the remoted, networked architecture of classical fiber sensors.\n"
        "5. **Cost-efficient interferometry** — Vernier-style cascading squeezes more resolution "
        "from simple, cheap all-fiber elements.\n\n"
        "روندها: (۱) هم‌آمیزی حسگری توزیع‌شده و یادگیری عمیق؛ (۲) گذار از «قطعه» به «سامانه/شبکه» "
        "خودمختار؛ (۳) نظریه پوشش و استقرار (پرکولاسیون)؛ (۴) پیوند حسگری کوانتومی با فیبر؛ "
        "(۵) تداخل‌سنجی کم‌هزینه با بزرگ‌نمایی ورنیه."
    ),
    "tech_trend_en": (
        "The centre of gravity in optical fiber sensing is shifting from improving a single "
        "transducer to engineering the whole chain — integrated-photonic sources, fiber "
        "distribution, and a learned analysis/calibration layer — into autonomous systems. "
        "DAS in particular is maturing from 'we can record' to 'we can operationalise', with the "
        "bottleneck now in data interpretation and deployment strategy rather than raw hardware. "
        "In parallel, quantum spin sensors are borrowing the fiber-remoting playbook, signalling "
        "an emerging quantum branch of distributed fiber sensing."
    ),
    "tech_trend_fa": (
        "مرکز ثقل حسگری فیبر نوری از بهبود یک مبدل واحد به مهندسی کل زنجیره — منابع فوتونیک "
        "مجتمع، توزیع فیبری و یک لایه تحلیل/کالیبراسیون یادگیرنده — در قالب سامانه‌های خودمختار "
        "جابه‌جا می‌شود. به‌ویژه DAS از مرحله «می‌توانیم ثبت کنیم» به «می‌توانیم عملیاتی کنیم» "
        "رسیده و گلوگاه اکنون در تفسیر داده و راهبرد استقرار است نه سخت‌افزار خام. هم‌زمان، "
        "حسگرهای اسپینی کوانتومی از الگوی «از‌راه‌دورسازی فیبری» بهره می‌گیرند و شاخه‌ای کوانتومی "
        "از حسگری توزیع‌شده فیبری در حال شکل‌گیری است."
    ),
    "suggestions_md": (
        "- **Benchmark ML-DAS across sites** — DASNet-style catalogues need cross-cable transfer "
        "studies to become trustworthy operational tools.\n"
        "- **Field-validate integrated FBG interrogators** — quantify range, multiplexing count and "
        "long-term drift of ML-calibrated integrated lasers under real loading.\n"
        "- **Couple coverage theory to real telecom maps** — test the 51.6% percolation threshold "
        "on actual municipal dark-fiber topologies.\n"
        "- **Characterise RFoF links for quantum sensing** — phase noise, power budget and reach "
        "limits for spin control over fiber.\n"
        "- **Standardisation for engineering acceptance** — pursue the calibration/standards gap the "
        "transportation-DFOS review flags.\n\n"
        "پیشنهادها: محک‌زنی ML-DAS میان‌مکانی؛ اعتبارسنجی میدانی بازخوان‌های FBG مجتمع؛ پیوند نظریه "
        "پوشش با نقشه واقعی فیبر مخابراتی؛ مشخصه‌یابی پیوند RFoF برای حسگری کوانتومی؛ و استانداردسازی "
        "برای پذیرش مهندسی."
    ),
}


def main() -> None:
    papers = load_papers()
    # Persist (regenerates the CSV from the curated JSON) and rebuild artefacts.
    save_papers(papers)
    day_papers = papers_for_date(papers, DAY) or papers
    write_report(day_papers, TRENDS, DAY)
    write_figures(papers)
    update_readme(papers)
    print(f"Generated report + CSV + figures + README for {DAY} ({len(day_papers)} papers).")


if __name__ == "__main__":
    main()
