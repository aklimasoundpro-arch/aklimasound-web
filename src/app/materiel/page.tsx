"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QuoteModal } from "@/components/Modals";
import { Reveal } from "@/components/motion";
import { SectionHead } from "@/components/ui";
import { Icon, IconTile } from "@/components/icons";
import { useWa } from "@/components/WaGate";
import { useI18n } from "@/lib/i18n";
import { track } from "@/lib/track";

const INSTALL = [
  { icon: "church", t: { fr: "Églises & lieux de culte", en: "Churches & worship venues" }, d: { fr: "Correction d'écho, réglages anti-larsen, sonorisation multi-zones auditorium + esplanade.", en: "Echo correction, anti-feedback tuning, multi-zone sound for auditorium + esplanade." } },
  { icon: "building", t: { fr: "Entreprises & conférences", en: "Companies & conference rooms" }, d: { fr: "Systèmes de conférence, micros de table, sonorisation d'ambiance et d'évacuation.", en: "Conference systems, table mics, background and evacuation sound." } },
  { icon: "martini", t: { fr: "HORECA & bars/maquis", en: "HORECA & bars" }, d: { fr: "Installations fixes longue durée adaptées aux fortes sollicitations acoustiques.", en: "Long-lasting fixed installs built for heavy acoustic use." } },
];

export default function Materiel() {
  const { lang } = useI18n();
  const { send } = useWa();
  const [open, setOpen] = useState(false);
  const L2 = (v: { fr: string; en: string }) => v[lang];
  const fr = lang === "fr";

  const askStudy = () => {
    track("study_request_click", { label: "installation fixe" });
    send(
      fr
        ? "Bonjour Aklimasound, je souhaite demander une étude pour une installation fixe (lieu, surface et besoin à préciser)."
        : "Hello Aklimasound, I would like to request a study for a fixed installation (venue, size and needs to be defined)."
    );
  };

  return (
    <>
      <Navbar onQuote={() => setOpen(true)} />
      <QuoteModal open={open} onClose={() => setOpen(false)} preset={fr ? "Étude installation fixe" : "Fixed installation study"} />
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <SectionHead
          kicker={fr ? "Matériel & intégration" : "Equipment & integration"}
          title={fr ? "Installation fixe sur-mesure — et bientôt la boutique" : "Bespoke fixed installation — shop coming soon"}
          sub={fr ? "Étude acoustique, fourniture, installation, formation de vos équipes et maintenance préventive, partout au Togo." : "Acoustic study, supply, installation, team training and preventive maintenance, across Togo."}
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-ivory/10 bg-black">
              <Image src="/img/materiel-render-1.jpg" alt="Système line array Aklimasound" width={1168} height={880} className="w-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-3xl border border-ivory/10 bg-black">
              <Image src="/img/materiel-render-2.jpg" alt="Parc sonorisation Aklimasound" width={1190} height={896} className="w-full object-cover" />
            </div>
          </Reveal>
        </div>

        {/* ---- Installation fixe (activée) ---- */}
        <div className="mt-20">
          <SectionHead title={fr ? "Installation fixe & configuration sur-mesure" : "Fixed installation & bespoke configuration"} />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {INSTALL.map((c, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="glass card-hover h-full rounded-3xl border-gold/30 p-6">
                  <IconTile name={c.icon} />
                  <h3 className="mt-4 font-display font-bold text-gold">{L2(c.t)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/65">{L2(c.d)}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-col items-center gap-4 text-center">
              <p className="max-w-2xl text-sm text-ivory/65">
                {fr
                  ? "Chaque installation commence par une étude : relevé acoustique du lieu, dimensionnement du matériel, plan d'implantation et devis ferme."
                  : "Every installation starts with a study: venue acoustic survey, equipment sizing, layout plan and firm quote."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={askStudy} data-track="study_request_click" data-label="CTA installation" className="btn btn-wa">
                  <Icon name="chat" className="h-4 w-4" /> {fr ? "Demander une étude" : "Request a study"}
                </button>
                <button onClick={() => setOpen(true)} className="btn btn-gold">
                  <Icon name="ruler" className="h-4 w-4" /> {fr ? "Formulaire de devis" : "Quote form"}
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ---- Formation & SAV ---- */}
        <Reveal delay={0.1}>
          <div className="glass mt-16 grid items-center gap-8 rounded-3xl border-gold/40 bg-gradient-to-br from-gold/10 to-copper/10 p-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-display text-2xl font-bold">{fr ? "Formation & service après-vente" : "Training & after-sales service"}</h3>
              <p className="mt-2 max-w-2xl text-sm text-ivory/70">
                {fr
                  ? "Formation de vos techniciens internes (techniciens d'église, régisseurs) et maintenance préventive de votre parc matériel."
                  : "Training for your in-house technicians (church techs, stage managers) and preventive maintenance of your equipment."}
              </p>
            </div>
            <button onClick={askStudy} className="btn btn-outline"><Icon name="phone" className="h-4 w-4" /> {fr ? "En parler" : "Talk to us"}</button>
          </div>
        </Reveal>

        {/* ---- Boutique : teaser d'ouverture ---- */}
        <Reveal delay={0.1}>
          <div className="relative mt-20 overflow-hidden rounded-3xl border border-ivory/12 bg-ink-2/70 p-10 text-center">
            <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 50% 0%, var(--color-gold), transparent 60%)" }} />
            <span className="chip mx-auto"><Icon name="package" className="h-3.5 w-3.5" /> {fr ? "Ouverture prochaine" : "Opening soon"}</span>
            <h3 className="mt-5 font-display text-3xl font-bold">{fr ? "La boutique Aklimasound arrive bientôt" : "The Aklimasound shop is coming soon"}</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-ivory/65">
              {fr
                ? "Enceintes, consoles, micros, traitements acoustiques et accessoires pro — sélectionnés et testés par nos ingénieurs, avec garantie et conseils d'installation. Vente en ligne et retrait à Lomé."
                : "Speakers, consoles, mics, acoustic treatment and pro accessories — selected and tested by our engineers, with warranty and installation advice. Online sales and pickup in Lomé."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => send(fr ? "Bonjour Aklimasound, prévenez-moi dès l'ouverture de la boutique en ligne !" : "Hello Aklimasound, notify me as soon as the online shop opens!")}
                data-track="shop_notify_click"
                className="btn btn-wa">
                <Icon name="chat" className="h-4 w-4" /> {fr ? "Prévenez-moi de l'ouverture" : "Notify me at launch"}
              </button>
              <button onClick={() => setOpen(true)} className="btn btn-outline">{fr ? "Commande spéciale déjà" : "Special order now"}</button>
            </div>
            <p className="mt-4 text-[11px] text-ivory/40">
              {fr ? "Besoin d'un équipement précis avant l'ouverture ? Nous sourçons pour vous sur demande." : "Need specific gear before launch? We source on request."}
            </p>
          </div>
        </Reveal>
      </section>
      <Footer />
    </>
  );
}
