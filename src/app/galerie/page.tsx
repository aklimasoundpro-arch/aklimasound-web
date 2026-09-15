"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Reveal } from "@/components/motion";
import { SectionHead } from "@/components/ui";
import { Icon } from "@/components/icons";
import { GALLERY } from "@/lib/data";
import { useI18n, L } from "@/lib/i18n";

const FILTERS = [
  { id: "all", label: { fr: "Tous", en: "All" } },
  { id: "concert", label: { fr: "Concerts & Chorales", en: "Concerts & Choirs" } },
  { id: "religieux", label: { fr: "Cultes & Installations", en: "Services & Installs" } },
  { id: "installation", label: { fr: "Installations fixes", en: "Fixed installs" } },
];

export default function Galerie() {
  const { lang } = useI18n();
  const [f, setF] = useState("all");
  const items = GALLERY.filter((g) => f === "all" || g.tag === f || (f === "religieux" && g.tag === "religieux"));
  return (
    <>
      <Navbar onQuote={() => {}} />
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <SectionHead
          kicker={lang === "fr" ? "Terrain" : "Field"}
          title={lang === "fr" ? "Nos réalisations & événements en images" : "Our work & events in pictures"}
          sub={lang === "fr" ? "Concerts, cultes, mariages et installations fixes à Lomé." : "Concerts, church services, weddings and fixed installations in Lomé."}
        />
        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((x) => (
            <button key={x.id} onClick={() => setF(x.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${f === x.id ? "border-gold bg-gold text-black" : "border-ivory/20 text-ivory/60 hover:border-gold hover:text-gold"}`}>
              {L(x.label, lang)}
            </button>
          ))}
        </div>
        <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {items.map((g, i) => (
            <Reveal key={g.src} delay={i * 0.05} className="mb-4 break-inside-avoid">
              <figure className="group relative overflow-hidden rounded-2xl border border-ivory/10">
                <Image src={g.src} alt={L(g.alt, lang)} width={1200} height={g.span === "tall" ? 1600 : 800} className="w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/85 to-transparent p-4 text-xs text-ivory/85 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  {L(g.alt, lang)}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-ivory/45">
          {lang === "fr" ? "Les vidéos courtes (style Reels) arrivent avec l'espace d'administration média." : "Short-form videos (Reels style) arrive with the media admin space."}
        </p>
      </section>
      <Footer />
    </>
  );
}
