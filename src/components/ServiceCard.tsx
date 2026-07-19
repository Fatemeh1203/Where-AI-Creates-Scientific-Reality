import type { ServiceItem } from "@/content/schema";
import { Icon } from "./Icons";

export function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <div className="glass-card flex h-full flex-col p-7 transition-colors hover:border-firoozeh-400/30">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-firoozeh-500/20 to-banafsh-500/10 text-firoozeh-400">
        <Icon name={service.icon} className="h-6 w-6" />
      </div>
      <h3 className="font-heading text-xl font-semibold text-white">{service.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{service.description}</p>
      <ul className="mt-5 space-y-2">
        {service.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2 text-sm text-slate-300">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-firoozeh-400" />
            {bullet}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex-1" />
      <p className="mt-4 border-t border-white/10 pt-4 font-heading text-sm font-semibold gradient-text-gold">
        {service.startingPrice}
      </p>
    </div>
  );
}
