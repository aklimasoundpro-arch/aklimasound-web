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
import { CONTACT, waLink } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

const CATS = [
  { icon: "speaker", t: { fr: "Enceintes & caissons", en: "Speakers & subwoofers" }, d: { fr: "Enceintes de sonorisation, caissons de basse, line array compact.", en: "PA speakers, subwoofers, compact line array." } },
  { icon: "sliders", t: { fr: "Consoles de mixage", en: "Mixing consoles" }, d: { fr: "Consoles numériques et analogiques, racks de traitement.", en: "Digital and analogue consoles, processing racks." } },
  { icon: "mic", t: { fr: "Micros filaires & HF", en: "Wired & wireless mics" }, d: { fr: "Micros chant, pupitre, casques/cravates, systèmes HF complets.", en: "Vocal, podium, headset/lavalier mics, full HF systems." } },
  { icon: "cable", t: { fr: "Traitement & câblage", en: "Processing & cabling" }, d: { fr: "Traitements acoustiques, multipaires, câblage professionnel.", en: "Acoustic treatment, stage boxes, professional cabling." } },
];

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
  return (
    <>
      <Navbar onQuote={() => setOpen(true)} />
      <QuoteModal open={open} onClose={() => setOpen(false)} preset={lang === "fr" ? "Étude vente / installation" : "Sales / installation study"} />
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <SectionHead
          kicker={lang === "fr" ? "Boutique pro" : "Pro shop"}
          title={lang === "fr" ? "Vente de matériel & intégration acoustique" : "Equipment sales & acoustic integration"}
          sub={lang === "fr" ? "Fourniture, installation fixe sur-mesure, formation de vos équipes et maintenance préventive." : "Supply, bespoke fixed installation, team training and preventive maintenance."}
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
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATS.map((c, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <div className="glass card-hover h-full rounded-3xl p-6">
                <IconTile name={c.icon} />
                <h3 className="mt-4 font-display font-bold">{L2(c.t)}</h3>
                <p className="mt-2 text-sm text-ivory/60">{L2(c.d)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20">
          <SectionHead title={lang === "fr" ? "Installation fixe & configuration sur-mesure" : "Fixed installation & bespoke configuration"} />
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
        </div>

        <Reveal delay={0.1}>
          <div className="glass mt-16 grid items-center gap-8 rounded-3xl border-gold/40 bg-gradient-to-br from-gold/10 to-copper/10 p-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-display text-2xl font-bold">{lang === "fr" ? "Formation & service après-vente" : "Training & after-sales service"}</h3>
              <p className="mt-2 max-w-2xl text-sm text-ivory/70">
                {lang === "fr"
                  ? "Formation de vos techniciens internes (techniciens d'église, régisseurs) et maintenance préventive de votre parc matériel."
                  : "Training for your in-house technicians (church techs, stage managers) and preventive maintenance of your equipment."}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setOpen(true)} className="btn btn-gold"><Icon name="ruler" className="h-4 w-4" /> {lang === "fr" ? "Obtenir une étude" : "Get a study"}</button>
              <button onClick={() => send("Bonjour Aklimasound, je souhaite un renseignement sur la vente & installation de matériel (offre : Vente & Installation Fixe).")} className="btn btn-wa"><Icon name="chat" className="h-4 w-4" /> WhatsApp</button>
            </div>
          </div>
        </Reveal>
      </section>
      <Footer />
    </>
  );
}
