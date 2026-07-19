import type { Locale } from "@/content/schema";
import { getContent } from "@/content";
import { PageShell } from "@/components/PageShell";
import { ContactForm } from "@/components/ContactForm";

export function ContactBody({ locale }: { locale: Locale }) {
  const content = getContent(locale);
  const { contact } = content;

  return (
    <PageShell locale={locale} content={content}>
      <section className="pb-24 pt-20 sm:pt-28">
        <div className="container-page grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow mb-3">{contact.eyebrow}</p>
            <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">{contact.title}</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">{contact.subtitle}</p>

            <div className="glass-card mt-10 space-y-5 p-6">
              <h3 className="text-sm font-semibold text-slate-200">{contact.directTitle}</h3>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{contact.directEmail}</p>
                <a href="mailto:f.shams.apg@gmail.com" className="text-sm text-firoozeh-400 hover:text-firoozeh-300">
                  f.shams.apg@gmail.com
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{contact.directLocation}</p>
                <p className="text-sm text-slate-300">{contact.locationValue}</p>
              </div>
            </div>
          </div>

          <ContactForm locale={locale} content={contact} />
        </div>
      </section>
    </PageShell>
  );
}
