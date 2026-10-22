"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SoundWaves from "@/components/SoundWaves";
import { BlurText, Reveal, CountUp, EqBars } from "@/components/motion";
import { SectionHead, TrustStrip } from "@/components/ui";
import { Icon, IconTile } from "@/components/icons";
import { useWa } from "@/components/WaGate";
import { QuoteModal, SignupModal, BookingModal } from "@/components/Modals";
import { DOMAINS, SOLUTIONS, WHY, GALLERY, CONTACT, waLink, fcfa } from "@/lib/data";
import { useI18n, L } from "@/lib/i18n";

export default function Home() {
  const { t, lang } = useI18n();
  const { send } = useWa();
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quotePreset, setQuotePreset] = useState<string | undefined>();
  const [bookOpen, setBookOpen] = useState(false);

  const openQuote = (preset?: string) => { setQuotePreset(preset); setQuoteOpen(true); };

  return (
    <>
      <Navbar onQuote={() => openQuote()} />
      <SignupModal />
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} preset={quotePreset} />
      <BookingModal open={bookOpen} onClose={() => setBookOpen(false)} />

      {/* ============ HERO : AFFICHE AKS RECOMPOSÉE — chaque élément extrait, visible sur tout écran ============ */}
      <section className="relative overflow-hidden bg-black">
        <div className="mx-auto w-full max-w-[1400px]">
          {/* Lignes de vagues — haut de l'affiche */}
          <Image src="/img/poster/waves.png" alt="" width={1254} height={144} priority sizes="(max-width:1400px) 100vw, 1400px" className="block h-auto w-full" />
          {/* Colonnes exactes de l'affiche : enceinte | logo AKS | micro */}
          <div className="flex items-start">
            <Image src="/img/poster/speaker.png" alt="Enceinte de sonorisation professionnelle" width={190} height={624} priority sizes="(max-width:1400px) 15vw, 212px" className="block h-auto w-[15.15%]" />
            <div className="w-[2.55%]" aria-hidden="true" />
            <Image src="/img/poster/logo.png" alt="AKS — Aklimasound, la passion du son" width={819} height={622} priority sizes="(max-width:1400px) 65vw, 914px" className="block h-auto w-[65.31%]" />
            <Image src="/img/poster/mic.png" alt="Microphone de studio" width={213} height={644} priority sizes="(max-width:1400px) 17vw, 238px" className="block h-auto w-[16.99%]" />
          </div>
          {/* Rangée des 5 métiers : bande fidèle de l'affiche sur grand écran… */}
          <Reveal delay={0.25}>
            <Image src="/img/poster/services-strip.png" alt="Nos 5 métiers : sonorisation, mixage, régie événementielle, installation et optimisation audio, écoute expertise" width={1254} height={156} sizes="(max-width:1400px) 100vw, 1400px" className="hidden h-auto w-full lg:block" />
            {/* …tuiles agrandies et lisibles sur mobile et tablette */}
            <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-5 px-6 py-7 lg:hidden">
              {([["svc-1", "Sonorisation"], ["svc-2", "Mixage"], ["svc-3", "Régie événementielle"], ["svc-4", "Installation & optimisation audio"], ["svc-5", "Écoute expertise"]] as const).map(([sl, slabel]) => (
                <Image key={sl} src={`/img/poster/${sl}.png`} alt={slabel} width={220} height={151} sizes="(max-width:640px) 40vw, 25vw" className="block h-auto w-36 sm:w-44" />
              ))}
            </div>
          </Reveal>
        </div>
        {/* Informations textuelles du site : sous le dernier texte de l'affiche, jamais par-dessus */}
        <div className="relative mx-auto w-full max-w-4xl px-6 pb-12 pt-8 text-center sm:pb-16 sm:pt-10">
          <div className="pointer-events-none absolute inset-0 opacity-70"><SoundWaves waves={4} density={0.7} /></div>
          <div className="relative">
            <Reveal y={14}>
              <p className="chip mb-6">{t("hero_kicker")}</p>
            </Reveal>
            <h1 className="sr-only">Aklimasound — Sonorisation professionnelle, vente & installation de matériel audio au Togo</h1>
            <Reveal delay={0.2}>
              <p className="mx-auto max-w-3xl font-display text-xl font-semibold text-ivory sm:text-2xl">
                <BlurText text={t("hero_sub")} delay={70} />
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ivory/70 sm:text-base">{t("hero_desc")}</p>
            </Reveal>
            <Reveal delay={0.45}>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button onClick={() => openQuote()} className="btn btn-gold"><Icon name="calendar" className="h-4 w-4" /> {t("cta_book")}</button>
                <Link href="/galerie" className="btn btn-outline"><Icon name="headphones" className="h-4 w-4" /> {t("cta_beats")} <span className="chip !py-0 !text-[9px]">Bientôt</span></Link>
                <Link href="/materiel" className="btn btn-outline"><Icon name="package" className="h-4 w-4" /> {t("cta_shop")}</Link>
              </div>
            </Reveal>
            <Reveal delay={0.65}>
              <div className="mx-auto mt-12 grid max-w-xl grid-cols-3 gap-6">
                {[{ n: 30, s: "", l: lang === "fr" ? "formules calibrées" : "calibrated packages" }, { n: 10, s: "", l: lang === "fr" ? "domaines couverts" : "fields covered" }, { n: 100, s: "%", l: lang === "fr" ? "ponctualité" : "punctuality" }].map((k, i) => (
                  <div key={i}>
                    <p className="font-display text-3xl font-bold text-gold"><CountUp to={k.n} suffix={k.s} /></p>
                    <p className="text-xs uppercase tracking-widest text-ivory/50">{k.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
        {/* Console de mixage — bas de l'affiche, pleine largeur sur tout écran */}
        <Reveal delay={0.3}>
          <div className="relative">
            <Image src="/img/poster/console.png" alt="Console de mixage professionnelle en régie" width={1254} height={310} sizes="100vw" className="block h-auto w-full" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-b from-transparent to-ink" aria-hidden="true" />
          </div>
        </Reveal>
      </section>

      <TrustStrip />

      {/* ============ DOMAINES ============ */}
      <section className="mx-auto max-w-7xl px-6 py-24" id="domaines">
        <SectionHead kicker={lang === "fr" ? "Nos services" : "Our services"} title={t("sec_domains")} sub={t("sec_domains_sub")} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d, i) => {
            const min = Math.min(...d.offers.filter((o) => o.price).map((o) => o.price!));
            return (
              <Reveal key={d.slug} delay={i * 0.06}>
                <Link href={`/services/${d.slug}`} className="glass card-hover group flex h-full flex-col rounded-3xl p-6">
                  <div className="flex items-center justify-between">
                    <IconTile name={d.icon} />
                    {d.estimate ? <span className="chip !text-[9px] !py-0.5">Tarifs estimés</span> : <EqBars className="text-gold/60 h-4 opacity-0 transition group-hover:opacity-100" />}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold group-hover:text-gold transition-colors">{L(d.name, lang)}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ivory/60">{L(d.tagline, lang)}</p>
                  <p className="mt-4 text-sm text-ivory/50">{t("from")} <span className="font-display font-bold text-gold">{fcfa(min)}</span></p>
                  <p className="mt-3 text-sm font-semibold text-gold opacity-0 transition group-hover:opacity-100">{t("see_offers")} →</p>
                </Link>
              </Reveal>
            );
          })}
          <Reveal delay={0.42}>
            <Link href="/materiel" className="glass card-hover flex h-full flex-col justify-between rounded-3xl border-gold/40 bg-gradient-to-br from-gold/15 to-copper/10 p-6">
              <IconTile name="wrench" iconClass="h-5 w-5 text-gold" />
              <div>
                <h3 className="mt-4 font-display text-lg font-bold text-gold">{lang === "fr" ? "Vente & installation fixe" : "Sales & fixed installation"}</h3>
                <p className="mt-2 text-sm text-ivory/70">{lang === "fr" ? "Églises, auditoriums, salles de conférence, bars & maquis : étude, fourniture, pose et formation." : "Churches, auditoriums, conference rooms, bars: study, supply, installation and training."}</p>
                <p className="mt-4 text-sm font-semibold text-gold">{lang === "fr" ? "Obtenir une étude →" : "Get a study →"}</p>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ SOLUTIONS PHARES ============ */}
      <section className="border-y border-ivory/10 bg-ink-2/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead center kicker="Best-sellers" title={t("sec_solutions")} />
          <div className="mt-12 space-y-4">
            {SOLUTIONS.map((s, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <Link href={s.href} className="glass card-hover group grid items-center gap-4 rounded-2xl p-5 sm:grid-cols-[auto_1fr_auto]">
                  <IconTile name={s.icon} />
                  <div>
                    <h3 className="font-display font-bold group-hover:text-gold transition-colors">{L(s.name, lang)}</h3>
                    <p className="mt-1 text-sm text-ivory/60">{L(s.desc, lang)}</p>
                  </div>
                  <span className="chip whitespace-nowrap">{typeof s.pack === "string" ? s.pack : L(s.pack, lang)}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PARC MATÉRIEL ============ */}
      <section className="border-y border-ivory/10 bg-ink-2/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHead
            center
            kicker={lang === "fr" ? "Le parc" : "The fleet"}
            title={lang === "fr" ? "Un matériel professionnel, visible et vérifiable" : "Professional gear, visible and verifiable"}
            sub={lang === "fr" ? "Line array, caissons, retours de scène et régie : exactement ce qui sera installé à votre événement." : "Line array, subwoofers, stage monitors and FOH: exactly what will be installed at your event."}
          />
          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.35fr_1fr]">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-ivory/10 bg-black">
                <Image src="/img/materiel-render-1.jpg" alt={lang === "fr" ? "Système line array Aklimasound : façade, caissons et retours" : "Aklimasound line array system: FOH, subs and wedges"} width={1168} height={880} className="w-full object-cover" />
              </div>
            </Reveal>
            <div className="space-y-4">
              {[
                { i: "speaker", t: { fr: "Système line array haute performance", en: "High-performance line array system" }, d: { fr: "Façade modulable 3 à 6 boîtes par côté, portée longue distance anti-larsen.", en: "Scalable FOH, 3 to 6 boxes per side, long-throw feedback-free coverage." } },
                { i: "sliders", t: { fr: "Subwoofers & basses puissantes", en: "Subwoofers & powerful bass" }, d: { fr: "Caissons 18\" appairés pour une assise profonde sans distorsion.", en: "Paired 18\" subs for deep, distortion-free low end." } },
                { i: "mic", t: { fr: "Retours de scène (moniteurs)", en: "Stage monitors (wedges)" }, d: { fr: "Bains de pieds et retours individuels pour artistes et chorales.", en: "Wedges and individual monitors for artists and choirs." } },
                { i: "sliders", t: { fr: "Régie complète : amplification & mixage", en: "Full FOH: amplification & mixing" }, d: { fr: "Consoles numériques, traitement, micros HF et techniciens dédiés.", en: "Digital consoles, processing, HF mics and dedicated technicians." } },
              ].map((x, i) => (
                <Reveal key={i} delay={i * 0.07}>
                  <div className="glass card-hover flex gap-4 rounded-2xl p-4">
                    <IconTile name={x.i} className="h-11 w-11 shrink-0" iconClass="h-5 w-5 text-gold" />
                    <div>
                      <h3 className="font-display font-bold">{L(x.t, lang)}</h3>
                      <p className="mt-1 text-sm text-ivory/60">{L(x.d, lang)}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={0.3}>
                <div className="overflow-hidden rounded-2xl border border-ivory/10 bg-black">
                  <Image src="/img/materiel-render-2.jpg" alt={lang === "fr" ? "Vue 3/4 du parc sonorisation Aklimasound" : "3/4 view of the Aklimasound sound fleet"} width={1190} height={896} className="w-full object-cover" loading="lazy" />
                </div>
              </Reveal>
            </div>
          </div>

          {/* Affiche officielle encadrée */}
          <Reveal delay={0.1}>
            <div className="mt-14 flex flex-col items-center gap-8 md:flex-row md:justify-center">
              <div className="w-full max-w-sm -rotate-1 rounded-2xl border border-gold/30 bg-ink p-3 shadow-[0_30px_80px_-30px_rgba(255,255,255,.35)] transition hover:rotate-0">
                <Image src="/img/affiche-sono-1.jpg" width={1080} height={1080} alt={lang === "fr" ? "Affiche Aklimasound — sonorisation professionnelle" : "Aklimasound poster — professional sound"} className="rounded-xl" loading="lazy" />
              </div>
              <div className="max-w-md text-center md:text-left">
                <h3 className="font-display text-2xl font-bold">{lang === "fr" ? "L'affiche officielle" : "The official poster"}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/65">
                  {lang === "fr"
                    ? "Partagez-la, affichez-la : faites vibrer votre événement avec Aklimasound, la puissance du son pro à votre portée."
                    : "Share it, post it: make your event vibrate with Aklimasound, pro sound power within your reach."}
                </p>
                <a href="/img/affiche-sono-1.jpg" target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-5">
                  <Icon name="camera" className="h-4 w-4" /> {lang === "fr" ? "Voir / télécharger l'affiche" : "View / download the poster"}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ GALERIE TEASER ============ */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead kicker="Terrain" title={t("sec_gallery")} sub={t("sec_gallery_sub")} />
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 [scroll-snap-type:x_mandatory]">
          {GALLERY.map((g, i) => (
            <Reveal key={g.src} delay={i * 0.05} className="[scroll-snap-align:start] shrink-0">
              <div className="relative h-64 w-80 overflow-hidden rounded-2xl border border-ivory/10 sm:w-96">
                <Image src={g.src} alt={L(g.alt, lang)} width={800} height={500} className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-xs text-ivory/80">{L(g.alt, lang)}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal><Link href="/galerie" className="btn btn-outline mt-4"><Icon name="camera" className="h-4 w-4" /> {lang === "fr" ? "Voir toute la galerie média" : "See the full media gallery"}</Link></Reveal>
      </section>

      {/* ============ BEATSTORE TEASER ============ */}
      <section className="border-y border-ivory/10 bg-ink-2/50 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
          <Reveal>
            <p className="chip mb-4"><Icon name="headphones" className="h-3.5 w-3.5" /> {t("sec_beatstore")} — <span className="text-ivory/60">phase 2</span></p>
            <h2 className="font-display text-3xl font-bold">{lang === "fr" ? "Besoin de beats tendances & prêts pour le studio ?" : "Need trend-ready beats for the studio?"}</h2>
            <p className="mt-3 text-ivory/65">{lang === "fr" ? "Afrobeats, Gospel, Amapiano, Trap et sonorités traditionnelles. Écoutez la démo, choisissez votre licence et téléchargez vos fichiers WAV & Stems. Ouverture du beatstore sécurisé très bientôt." : "Afrobeats, Gospel, Amapiano, Trap and traditional sounds. Preview, pick your licence and download WAV & Stems. Secure beatstore opening soon."}</p>
            <div className="mt-6 flex items-center gap-2 text-gold">
              <EqBars n={12} className="h-8" />
              <span className="text-xs uppercase tracking-[0.3em] text-ivory/40">Aklimasound Production</span>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="glass rounded-3xl p-6">
              {[{ g: "Gospel Worship", b: 72 }, { g: "Afrobeats", b: 104 }, { g: "Amapiano", b: 112 }].map((x, i) => (
                <div key={i} className="flex items-center justify-between border-b border-ivory/10 py-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 bg-white/5 text-ivory/70"><Icon name="play" className="h-4 w-4" /></span>
                    <div><p className="text-sm font-semibold">{x.g} — {lang === "fr" ? "extrait verrouillé" : "locked preview"}</p><p className="text-xs text-ivory/45">{x.b} BPM</p></div>
                  </div>
                  <span className="chip !text-[9px]">Bientôt</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ POURQUOI ============ */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <SectionHead center title={t("sec_why")} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="glass card-hover h-full rounded-3xl p-6">
                <IconTile name={w.icon} />
                <h3 className="mt-4 font-display font-bold">{L(w.t, lang)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/60">{L(w.d, lang)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="relative overflow-hidden py-24">
        <SoundWaves density={0.6} waves={4} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">{t("sec_cta")}</h2>
            <p className="mt-3 text-ivory/60">{t("sec_cta_sub")}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={() => openQuote()} className="btn btn-gold"><Icon name="file" className="h-4 w-4" /> {lang === "fr" ? "Obtenir un devis gratuit" : "Get a free quote"}</button>
              <button onClick={() => send("Bonjour Aklimasound, je souhaite discuter d'un projet de sonorisation.")} className="btn btn-wa"><Icon name="chat" className="h-4 w-4" /> {lang === "fr" ? "Discuter sur WhatsApp" : "Chat on WhatsApp"}</button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
