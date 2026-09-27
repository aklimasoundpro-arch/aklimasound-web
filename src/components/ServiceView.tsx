"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Domain, CONTACT, waLink, GALLERY } from "@/lib/data";
import { useI18n, L } from "@/lib/i18n";
import { Reveal, BlurText } from "./motion";
import { PackCard, Faq, SectionHead } from "./ui";
import { Icon, IconTile } from "./icons";
import { useWa } from "./WaGate";
import { useMember, withDiscount } from "@/lib/member";
import { QuoteModal, BookingModal } from "./Modals";
import Navbar from "./Navbar";
import Footer from "./Footer";

const FAQS = [
  { q: { fr: "Combien de temps à l'avance faut-il réserver ?", en: "How far in advance should I book?" }, a: { fr: "Au moins 7 jours pour un weekend, 2 à 4 semaines pour un mariage ou un festival. Un repérage terrain est organisé 24 h avant les grands événements.", en: "At least 7 days for a weekend, 2 to 4 weeks for a wedding or festival. A site survey is organised 24 h before large events." } },
  { q: { fr: "Que comprend exactement le tarif affiché ?", en: "What exactly does the displayed price include?" }, a: { fr: "Transport, installation, balances, technicien(s) pendant la prestation et démontage. Les déplacements longue distance hors zone urbaine sont devisés séparément.", en: "Transport, setup, sound-check, technician(s) during the service and teardown. Long-distance travel outside the urban area is quoted separately." } },
  { q: { fr: "Comment se passe le paiement ?", en: "How does payment work?" }, a: { fr: "Acompte de 30 % ou 50 % à la réservation (Mixx by Yas / Flooz), solde le jour de l'événement. Facture professionnelle disponible pour les entreprises et institutions.", en: "30% or 50% deposit on booking (Mixx by Yas / Flooz), balance on the event day. Professional invoice available for companies and institutions." } },
  { q: { fr: "Que se passe-t-il en cas de panne technique ?", en: "What happens in case of a technical failure?" }, a: { fr: "Nous embarquons systématiquement du matériel de secours et, sur les formules hautes, un groupe électrogène. Un technicien reste sur site toute la prestation.", en: "We systematically carry backup gear and, on higher packages, a generator. A technician stays on site for the whole service." } },
];

export default function ServiceView({ domain }: { domain: Domain }) {
  const { t, lang } = useI18n();
  const { send } = useWa();
  const { connected, discount } = useMember();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [preset, setPreset] = useState<string | undefined>();
  const [bookOffer, setBookOffer] = useState<{ name: string; price: number | null } | undefined>();

  return (
    <>
      <Navbar onQuote={() => { setPreset(undefined); setQuoteOpen(true); }} />
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} preset={preset} />
      <BookingModal open={!!bookOffer} onClose={() => setBookOffer(undefined)} offer={bookOffer} />

      <section className="relative overflow-hidden pt-32 pb-16">
        <Image src={domain.hero} alt="" priority fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/50 to-ink" />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal y={12}>
            <nav className="mb-4 text-xs text-ivory/50">
              <Link href="/" className="hover:text-gold">{lang === "fr" ? "Accueil" : "Home"}</Link> / <span className="text-gold">{L(domain.name, lang)}</span>
            </nav>
            <IconTile name={domain.icon} className="h-14 w-14" iconClass="h-6 w-6 text-gold" />
            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              <BlurText text={L(domain.name, lang)} delay={80} className="text-gradient-gold" />
            </h1>
            <p className="mt-4 max-w-2xl text-ivory/70">{L(domain.tagline, lang)}</p>
            <button onClick={() => send(`Bonjour Aklimasound, je souhaite un renseignement sur le domaine ${L(domain.name, lang)}.`)} className="btn btn-wa mt-6"><Icon name="chat" className="h-4 w-4" /> {t("cwa")}</button>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {domain.offers.map((o, i) => (
            <PackCard
              key={o.name}
              offer={o}
              domainName={L(domain.name, lang)}
              delay={i * 0.1}
              onQuote={() => { setPreset(o.name); setQuoteOpen(true); }}
              onBook={() => setBookOffer({ name: o.name, price: o.price != null ? withDiscount(o.price, connected ? discount : 0) : null })}
            />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-ivory/45">
          {domain.estimate
            ? (lang === "fr"
              ? "Tarifs estimés pour ce domaine — en attente de validation Aklimasound. Frais de paiement Mobile Money déjà inclus."
              : "⚠️ Estimated prices for this field — pending Aklimasound validation. Mobile Money fees already included.")
            : (lang === "fr"
              ? "Tarifs indicatifs toutes taxes comprises, déplacements longue distance hors zone urbaine devisés séparément. Frais de paiement Mobile Money déjà inclus dans les prix affichés."
              : "Indicative prices, all taxes included, excluding long-distance travel outside the urban area. Mobile Money payment fees already included in displayed prices.")}
        </p>
      </section>

      <section className="border-y border-ivory/10 bg-ink-2/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead center title={t("sec_gallery")} />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {GALLERY.slice(0, 3).map((g, i) => (
              <Reveal key={g.src} delay={i * 0.08}>
                <div className="relative h-56 overflow-hidden rounded-2xl border border-ivory/10">
                  <Image src={g.src} alt={L(g.alt, lang)} width={700} height={450} className="h-full w-full object-cover" />
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/galerie" className="btn btn-outline"><Icon name="camera" className="h-4 w-4" /> {lang === "fr" ? "Toute la galerie" : "Full gallery"}</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <SectionHead center title={t("faq_title")} />
        <Faq items={FAQS.map((f) => ({ q: L(f.q, lang), a: L(f.a, lang) }))} />
      </section>

      <Footer />
    </>
  );
}
