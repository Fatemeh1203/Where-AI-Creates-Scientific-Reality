import type { TimelineItem } from "@/content/schema";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative space-y-8 border-s-2 border-white/10 ps-6">
      {items.map((item) => (
        <div key={item.title} className="relative">
          <span className="absolute -start-[31px] top-1 h-3 w-3 rounded-full bg-gradient-to-br from-firoozeh-400 to-lapis-500 ring-4 ring-night-950" />
          <p className="text-xs font-semibold uppercase tracking-wide text-firoozeh-400">{item.period}</p>
          <h4 className="mt-1 font-heading text-base font-semibold text-white">{item.title}</h4>
          <p className="text-sm text-slate-400">{item.place}</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
