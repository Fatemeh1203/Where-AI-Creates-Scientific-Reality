"""Regenerate the 2026-07-24 report/figures/README with rich bilingual trends."""
from __future__ import annotations

from database import load_papers, papers_for_date
from figures import write_figures
from readme_updater import update_readme
from report import write_report

DAY = "2026-07-24"

TRENDS = {
    "day_summary_en": (
        "Ten papers were logged today (two off-topic search false-positives were dropped). "
        "The batch is dominated by distributed acoustic sensing (DAS) and its data/processing chain — "
        "a deployable DAS array on a soft vine-robot for search-and-rescue, a cyclic-prefix-free OFDM "
        "waveform that raises DAS acoustic bandwidth, passive Scholte-wave seabed imaging over a 51-km "
        "cable, and two DAS-native computational-seismology methods (an acceleration/strain-rate wave "
        "equation and a velocity–stress–strain joint FWI). Two FBG works push AI into fiber sensing "
        "(fault-tolerant surgical force sensing; multimodal aerospace SHM fusion), while the day's "
        "standout is a fibre-integrated silicon-photonic sensor resolving single-protein dynamics at "
        "sub-microsecond speed. A wearable DOFS 'nearable' mat and a photonic in-optics event detector "
        "round out a distinctly systems- and AI-flavoured day, skewed strongly to July-2026 preprints."
    ),
    "day_summary_fa": (
        "امروز ده مقاله ثبت شد (دو موردِ بی‌ربط که جستجو اشتباهی آورده بود حذف شدند). این دسته را "
        "حسگریِ آکوستیکِ توزیع‌شده (DAS) و زنجیره‌ی داده/پردازشِ آن غالب کرده است — یک آرایه‌ی قابل‌استقرارِ "
        "DAS روی رباتِ نرمِ پیچکی برای جست‌وجو-نجات، یک شکل‌موجِ OFDMِ بدونِ پیشوندِ چرخه‌ای که پهنای‌باندِ "
        "آکوستیکِ DAS را بالا می‌برد، تصویربرداریِ غیرفعالِ موجِ اسکولت روی کابلِ ۵۱ کیلومتریِ بستر دریا، و دو "
        "روشِ لرزه‌شناسیِ محاسباتیِ بومیِ‌DAS. دو کارِ FBG هوشِ مصنوعی را به حسگریِ فیبری می‌رانند (حسگریِ نیرویِ "
        "جراحیِ خطاـتحمل؛ همجوشیِ SHMِ هوافضاییِ چندپیمانه‌ای)، و برجسته‌ترین کارِ روز، یک حسگرِ سیلیکون‌فوتونیکِ "
        "مجتمع با فیبر است که دینامیکِ تک‌پروتئین را در سرعتِ زیرمیکروثانیه تفکیک می‌کند. یک تشکِ پوشیدنیِ DOFS و "
        "یک آشکارسازِ رویدادِ درون‌نوری این روزِ به‌شدت سامانه‌ و هوش‌مصنوعی‌محور را کامل می‌کنند؛ روزی که به‌شدت "
        "به پیش‌چاپ‌های ژوئیه‌ی ۲۰۲۶ متمایل است."
    ),
    "trends_md": (
        "1. **DAS everywhere** — 5 of 10 papers are DAS or DAS-native processing: sensing, waveform "
        "design, passive imaging, and computational-seismology modeling/inversion.\n"
        "2. **Fiber sensing goes wearable/biomedical** — a DOFS physiological mat and a single-protein "
        "silicon-photonic sensor push fiber sensing toward the body and the single molecule.\n"
        "3. **AI is now inside the sensor stack** — self-supervised/mask-aware and Transformer models "
        "for FBG force sensing and multimodal SHM; in-optics event detection via microring self-pulsing.\n"
        "4. **Deployment creativity** — DAS on a shape-morphing soft robot reimagines where a sensing "
        "line can physically go.\n"
        "5. **Native-DAS computation** — modeling and inversion increasingly honor strain/strain-rate "
        "directly instead of converting to velocity.\n\n"
        "روندها: (۱) غلبه‌ی DAS؛ (۲) حرکتِ حسگریِ فیبری به‌سوی پوشیدنی/زیست‌پزشکی و تک‌مولکول؛ (۳) ورودِ هوشِ "
        "مصنوعی به درونِ پشته‌ی حسگر؛ (۴) خلاقیت در استقرار (DAS روی رباتِ نرم)؛ (۵) محاسباتِ بومیِ‌DAS."
    ),
    "tech_trend_en": (
        "Today sharpens yesterday's theme: optical fiber sensing is being re-engineered as a full "
        "system — novel deployment bodies, native-DAS waveforms and physics, and an AI layer that now "
        "lives inside the read-out (self-supervised fault tolerance, in-optics processing) rather than "
        "only in post-analysis. Two directions widen the field's reach: downward in scale (single-protein "
        "silicon-photonic sensing) and closer to the body (wearable DOFS). DAS continues to dominate "
        "volume, but its frontier has clearly moved from acquisition to waveform engineering, passive "
        "ambient-field exploitation, and computation that treats strain-rate as first-class."
    ),
    "tech_trend_fa": (
        "امروز مضمونِ دیروز را تیزتر می‌کند: حسگریِ فیبر نوری همچون یک سامانه‌ی کامل بازمهندسی می‌شود — بدنه‌های "
        "استقرارِ نو، شکل‌موج‌ها و فیزیکِ بومیِ‌DAS، و لایه‌ای از هوشِ مصنوعی که اکنون درونِ بازخوانی زندگی می‌کند "
        "(خطاـتحملِ خودـنظارتی، پردازشِ درون‌نوری) نه فقط در تحلیلِ پسین. دو جهت دامنه‌ی حوزه را می‌گسترانند: پایین "
        "در مقیاس (حسگریِ سیلیکون‌فوتونیکِ تک‌پروتئین) و نزدیک‌تر به بدن (DOFSِ پوشیدنی). DAS همچنان از نظرِ حجم "
        "غالب است، اما مرزِ آن آشکارا از برداشت به مهندسیِ شکل‌موج، بهره‌گیریِ غیرفعال از میدانِ محیطی و محاسباتی که "
        "نرخ‌کرنش را درجه‌یک می‌داند حرکت کرده است."
    ),
    "suggestions_md": (
        "- **Field-test deployable DAS arrays** (vine-robot) under realistic disaster acoustics.\n"
        "- **Validate CP-free OFDM DAS** experimentally over long fibers against the folding limit.\n"
        "- **Move the single-protein photonic sensor toward throughput** and diverse protein classes.\n"
        "- **Clinically validate fault-tolerant FBG force sensing** and wearable DOFS mats.\n"
        "- **Benchmark native-DAS FWI/modeling** against field multi-sensor datasets.\n\n"
        "پیشنهادها: آزمونِ میدانیِ آرایه‌های DASِ قابل‌استقرار؛ اعتبارسنجیِ تجربیِ OFDMِ بدونِ CP روی فیبرِ بلند؛ "
        "افزایشِ توانِ عبورِ حسگرِ فوتونیکِ تک‌پروتئین؛ اعتبارسنجیِ بالینیِ حسگریِ FBGِ خطاـتحمل و تشکِ DOFSِ پوشیدنی؛ "
        "و محک‌زنیِ FWI/مدل‌سازیِ بومیِ‌DAS با داده‌ی چندحسگریِ میدانی."
    ),
}


def main() -> None:
    papers = load_papers()
    day_papers = papers_for_date(papers, DAY)
    write_report(day_papers, TRENDS, DAY)
    write_figures(papers)
    update_readme(papers)
    print(f"Regenerated {DAY}: {len(day_papers)} papers in report; {len(papers)} total tracked.")


if __name__ == "__main__":
    main()
