"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Domain, CONTACT, waLink, GALLERY } from "@/lib/data";
import { useI18n, L } from "@/lib/i18n";
import { Reveal, BlurText } from "./motion";
import { PackCard, SectionHead } from "./ui";
import BannerHero from "./BannerHero";
import { Icon, IconTile } from "./icons";
import { useWa } from "./WaGate";
import { useMember, withDiscount } from "@/lib/member";
import { QuoteModal, BookingModal } from "./Modals";
import Navbar from "./Navbar";
import Footer from "./Footer";


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

      <BannerHero />
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-16">
        <div>
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
              ? "Tarifs estimés pour ce domaine — en attente de validation Aklimasound."
              : "⚠️ Estimated prices for this field — pending Aklimasound validation. Mobile Money fees already included.")
            : (lang === "fr"
              ? "Tarifs indicatifs toutes taxes comprises, déplacements longue distance hors zone urbaine devisés séparément. dans les prix affichés."
              : "Indicative prices, all taxes included, excluding long-distance travel outside the urban area. in displayed prices.")}
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

      <Footer />
    </>
  );
}
