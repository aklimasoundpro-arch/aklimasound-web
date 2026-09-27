"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QuoteModal } from "@/components/Modals";
import { Reveal } from "@/components/motion";
import { docBySlug, UPDATED, LEGAL_DOCS } from "@/lib/legal";
import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function LegalView({ slug }: { slug: string }) {
  const { lang } = useI18n();
  const [open, setOpen] = useState(false);
  const doc = docBySlug(slug);
  if (!doc) return null;
  return (
    <>
      <Navbar onQuote={() => setOpen(true)} />
      <QuoteModal open={open} onClose={() => setOpen(false)} />
      <section className="mx-auto max-w-3xl px-6 pb-24 pt-36">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-gold/80">{lang === "fr" ? "Document légal" : "Legal document"}</p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{doc.title[lang]}</h1>
          <p className="mt-2 text-sm text-ivory/50">{UPDATED[lang]}</p>
          <p className="mt-6 text-sm leading-relaxed text-ivory/70">{doc.intro[lang]}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 space-y-8">
            {doc.sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-display text-lg font-bold text-gold/90">{s.h[lang]}</h2>
                {s.p.map((para, j) => (
                  <p key={j} className="mt-2 text-sm leading-relaxed text-ivory/70">{para[lang]}</p>
                ))}
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 border-t border-ivory/10 pt-6">
          <p className="text-xs uppercase tracking-widest text-ivory/40">{lang === "fr" ? "Autres documents" : "Other documents"}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {LEGAL_DOCS.filter((d) => d.slug !== slug).map((d) => (
              <Link key={d.slug} href={`/legal/${d.slug}`} className="rounded-full border border-ivory/12 px-3 py-1.5 text-xs text-ivory/65 hover:border-gold/50 hover:text-gold">
                {d.title[lang]}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
