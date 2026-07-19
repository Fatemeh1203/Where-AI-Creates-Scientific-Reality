import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";
import { OrderForm } from "@/components/OrderForm";

export function OrderBody({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const { order } = content;

  return (
    <PageShell locale={locale} content={content}>
      <section className="pb-24 pt-20 sm:pt-28">
        <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow mb-3">{order.eyebrow}</p>
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">{order.title}</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">{order.subtitle}</p>

            <ol className="mt-10 space-y-5">
              {order.steps.map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-firoozeh-500 to-lapis-500 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-300">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <OrderForm locale={locale} content={order} />
        </div>
      </section>
    </PageShell>
  );
}
