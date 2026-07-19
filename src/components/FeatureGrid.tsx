import type { FeatureItem } from "@/content/schema";
import { Icon } from "./Icons";

const ACCENTS = [
  "from-firoozeh-500/20 to-firoozeh-500/0 text-firoozeh-400",
  "from-lapis-500/20 to-lapis-500/0 text-lapis-400",
  "from-banafsh-500/20 to-banafsh-500/0 text-banafsh-400",
  "from-anar-500/20 to-anar-500/0 text-anar-400",
  "from-zar-500/20 to-zar-500/0 text-zar-400",
  "from-firoozeh-500/20 to-lapis-500/0 text-firoozeh-300",
];

export function FeatureGrid({ features }: { features: FeatureItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, i) => (
        <div key={feature.title} className="glass-card group relative overflow-hidden p-6 transition-colors hover:border-white/20">
          <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${ACCENTS[i % ACCENTS.length]}`}>
            <Icon name={feature.icon} className="h-5.5 w-5.5" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-white">{feature.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
