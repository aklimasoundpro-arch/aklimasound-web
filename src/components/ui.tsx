"use client";
import { ReactNode } from "react";
import { Offer, fcfa, waLink, CONTACT } from "@/lib/data";
import { useI18n, L } from "@/lib/i18n";
import { Reveal } from "./motion";
import { Icon } from "./icons";
import { useWa } from "./WaGate";

export function SectionHead({ kicker, title, sub, center }: { kicker?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      {kicker && <p className="chip mb-4">{kicker}</p>}
      <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-[2.6rem] leading-tight">{title}</h2>
      {sub && <p className={`mt-3 text-ivory/60 ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>{sub}</p>}
    </Reveal>
  );
}

/** Carte formule avec les 3 CTA (WhatsApp / Devis / Réservation) */
export function PackCard({ offer, domainName, onQuote, onBook, delay = 0 }: {
  offer: Offer; domainName: string; onQuote: () => void; onBook: () => void; delay?: number;
}) {
  const { t, lang } = useI18n();
  const { send } = useWa();
  const waMsg = `Bonjour Aklimasound, je souhaite réserver l'offre ${offer.name} (${domainName}) pour mon événement.`;
  return (
    <Reveal delay={delay} className="h-full">
      <div className={`glass card-hover relative flex h-full flex-col rounded-3xl p-6 ${offer.star ? "border-gold/50 bg-gold/[0.06]" : ""}`}>
        {offer.star && <span className="chip absolute -top-3 left-6 bg-ink">★ {t("popular")}</span>}
        <h3 className="font-display text-xl font-bold">{offer.name}</h3>
        <p className="mt-2 font-display text-2xl font-bold text-gradient-gold">
          {offer.price ? fcfa(offer.price) : L(offer.priceLabel!, lang)}
        </p>
        <div className="mt-5 space-y-3 text-sm">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold/80">{t("includes")}</p>
            <p className="text-ivory/75 leading-relaxed">{L(offer.includes, lang)}</p>
          </div>
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory/40">{t("limits")}</p>
            <p className="text-ivory/55 leading-relaxed">{L(offer.limits, lang)}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-2 border-t border-ivory/10 pt-4">
          <button onClick={() => send(waMsg)} className="btn btn-wa !py-2.5 text-sm"><Icon name="chat" className="h-4 w-4" /> {t("cwa")}</button>
          <button onClick={onQuote} className="btn btn-outline !py-2.5 text-sm"><Icon name="file" className="h-4 w-4" /> {t("cta_quote")}</button>
          <button onClick={onBook} className="btn btn-gold !py-2.5 text-sm"><Icon name="zap" className="h-4 w-4" /> {t("cbook")}</button>
        </div>
      </div>
    </Reveal>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-3">
      {items.map((f, i) => (
        <Reveal key={i} delay={i * 0.06}>
          <details className="glass group rounded-2xl px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium marker:content-none">
              {f.q}
              <span className="text-gold transition-transform group-open:rotate-45">＋</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-ivory/65">{f.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}

export function TrustStrip() {
  const { t } = useI18n();
  const items = [t("trust_1"), t("trust_2"), t("trust_3"), t("trust_4")];
  return (
    <div className="relative overflow-hidden border-y border-ivory/10 bg-ink-2/60 py-3">
      <div className="marquee flex w-max gap-10 whitespace-nowrap px-6">
        {[...items, ...items, ...items, ...items].map((x, i) => (
          <span key={i} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-ivory/60">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {x}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Children({ children }: { children: ReactNode }) { return <>{children}</>; }
