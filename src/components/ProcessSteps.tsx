export function ProcessSteps({ steps }: { steps: { title: string; description: string }[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, i) => (
        <div key={step.title} className="glass-card relative p-6">
          <span className="font-heading text-4xl font-bold text-white/10">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-2 font-heading text-base font-semibold text-white">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.description}</p>
        </div>
      ))}
    </div>
  );
}
