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
      {/* Mobile : une seule bande aux proportions exactes de la bannière */}
      <div className="sm:hidden">
        <Reveal y={12}>
          <Image src="/img/banner/full.png"
            alt="AKS — Aklimasound : sonorisation, mixage, régie événementielle, installation et optimisation audio, écoute expertise"
            width={1983} height={793} priority sizes="100vw"
            className="block h-auto w-full" />
        </Reveal>
      </div>
    </section>
  );
}
