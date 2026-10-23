/** Hero des rubriques : bannière AKS recomposée en colonnes exactes, animée, jamais en fond. */
import Image from "next/image";
import { Reveal } from "./motion";
import { useI18n } from "@/lib/i18n";

const COLS = [
  { src: "/img/banner/console.png", w: 16.64, fr: "Console de mixage numérique en régie", en: "Digital mixing console in control room", float: true },
  { src: "/img/banner/list.png", w: 17.95, fr: "Nos prestations : sonorisation, mixage, régie événementielle, installation et optimisation audio", en: "Our services: sound reinforcement, mixing, event control, installation and audio optimisation", float: false },
  { src: "/img/banner/logo.png", w: 34.54, fr: "AKS — Aklimasound, la passion du son", en: "AKS — Aklimasound, the passion of sound", float: false },
  { src: "/img/banner/text.png", w: 11.14, fr: "Écoute expertise, solutions sur mesure", en: "Expert listening, tailored solutions", float: false },
  { src: "/img/banner/speaker.png", w: 19.72, fr: "Enceinte de sonorisation professionnelle", en: "Professional sound reinforcement speaker", float: true },
];

export default function BannerHero() {
  const { lang } = useI18n();
  return (
    <section className="relative overflow-hidden bg-black">
      {/* Écrans moyens et grands : colonnes exactes de la bannière */}
      <div className="hidden items-stretch sm:flex" aria-label="Aklimasound — la passion du son">
        {COLS.map((c, i) => (
          <div key={c.src} style={{ width: `${c.w}%` }}>
            <Reveal delay={0.12 * i} y={18}>
              <Image src={c.src} alt={lang === "fr" ? c.fr : c.en} width={Math.round(1983 * c.w / 100)} height={793}
                priority={i <= 2} sizes={`${c.w}vw`}
                className={`block h-auto w-full ${c.float ? "float-slow" : ""}`} />
            </Reveal>
          </div>
        ))}
      </div>
      {/* Mobile : éléments empilés, tous visibles */}
      <div className="flex flex-col items-center gap-5 px-4 pb-8 pt-24 sm:hidden">
        <Reveal y={16}><Image src="/img/banner/logo.png" alt={lang === "fr" ? "AKS — Aklimasound, la passion du son" : "AKS — Aklimasound, the passion of sound"} width={685} height={793} priority sizes="80vw" className="h-auto w-4/5 max-w-sm" /></Reveal>
        <Reveal delay={0.15}><Image src="/img/banner/list.png" alt={lang === "fr" ? "Nos prestations : sonorisation, mixage, régie événementielle, installation et optimisation audio" : "Our services: sound reinforcement, mixing, event control, installation and audio optimisation"} width={356} height={793} sizes="70vw" className="h-auto w-full max-w-[240px]" /></Reveal>
        <Reveal delay={0.25}><Image src="/img/banner/text.png" alt={lang === "fr" ? "Écoute expertise, solutions sur mesure" : "Expert listening, tailored solutions"} width={221} height={793} sizes="60vw" className="h-auto w-full max-w-[200px]" /></Reveal>
        <div className="flex w-full items-end gap-2">
          <Reveal delay={0.35} className="w-1/2"><Image src="/img/banner/console.png" alt={lang === "fr" ? "Console de mixage numérique en régie" : "Digital mixing console in control room"} width={330} height={793} sizes="50vw" className="float-slow h-auto w-full" /></Reveal>
          <Reveal delay={0.45} className="w-1/2"><Image src="/img/banner/speaker.png" alt={lang === "fr" ? "Enceinte de sonorisation professionnelle" : "Professional sound reinforcement speaker"} width={391} height={793} sizes="50vw" className="float-slow h-auto w-full" /></Reveal>
        </div>
      </div>
    </section>
  );
}
