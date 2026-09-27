"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { store } from "./store";

export type Lang = "fr" | "en";
type Dict = Record<string, { fr: string; en: string }>;

const D: Dict = {
  nav_services: { fr: "Services", en: "Services" },
  nav_materiel: { fr: "Matériel", en: "Equipment" },
  nav_logics: { fr: "LOGICS", en: "LOGICS" },
  nav_galerie: { fr: "Galerie", en: "Gallery" },
  nav_devis: { fr: "Devis", en: "Quote" },
  nav_beatstore: { fr: "Beatstore", en: "Beatstore" },
  nav_login: { fr: "Connexion", en: "Sign in" },
  cta_book: { fr: "Réserver une prestation", en: "Book a service" },
  cta_beats: { fr: "Écouter les beats", en: "Listen to beats" },
  cta_shop: { fr: "Acheter du matériel", en: "Buy equipment" },
  cta_quote: { fr: "Demander un devis", en: "Request a quote" },
  cwa: { fr: "Discuter sur WhatsApp", en: "Chat on WhatsApp" },
  cbook: { fr: "Réserver maintenant", en: "Book now" },
  hero_kicker: { fr: "Sonorisation • Installation Fixe • LOGICS • Beatstore — partout au Togo", en: "Sound systems • Fixed Installation • LOGICS • Beatstore — all across Togo" },
  hero_title: { fr: "AKLIMASOUND", en: "AKLIMASOUND" },
  hero_sub: {
    fr: "Le son qui sublime vos événements, vos intégrations & vos créations musicales, partout au Togo.",
    en: "The sound that elevates your events, your installations & your music creations, all across Togo.",
  },
  hero_desc: {
    fr: "Sonorisation professionnelle haute fidélité pour concerts, mariages et événements d'entreprise, installation fixe sur-mesure pour églises, ainsi qu'un beatstore exclusif pour vos productions musicales.",
    en: "High-fidelity professional sound for concerts, weddings and corporate events, bespoke fixed installations for churches, plus an exclusive beatstore for your music productions.",
  },
  trust_1: { fr: "100% ponctualité garantie", en: "100% punctuality guaranteed" },
  trust_2: { fr: "Ingénieurs du son qualifiés", en: "Qualified sound engineers" },
  trust_3: { fr: "Équipement pro haut de gamme", en: "High-end pro equipment" },
  trust_4: { fr: "Paiement Mobile Money (Mixx by Yas / Flooz)", en: "Mobile Money payment (Mixx by Yas / Flooz)" },
  sec_domains: { fr: "Nos domaines d'expertise", en: "Our fields of expertise" },
  sec_domains_sub: { fr: "10 univers, 30 formules calibrées pour chaque jauge et chaque lieu.", en: "10 universes, 30 packages calibrated for every crowd size and venue." },
  sec_solutions: { fr: "Nos solutions phares", en: "Flagship solutions" },
  sec_gallery: { fr: "Nos réalisations en images", en: "Our work in pictures" },
  sec_gallery_sub: { fr: "Concerts, cultes, mariages et installations fixes à Lomé.", en: "Concerts, church services, weddings and fixed installations in Lomé." },
  sec_beatstore: { fr: "Beatstore & production musicale", en: "Beatstore & music production" },
  sec_why: { fr: "Pourquoi choisir Aklimasound ?", en: "Why choose Aklimasound?" },
  sec_testimonials: { fr: "Ils nous font confiance", en: "They trust us" },
  sec_cta: { fr: "Prêt à réserver la sonorisation de votre prochain événement ?", en: "Ready to book the sound for your next event?" },
  sec_cta_sub: { fr: "Bloquez votre date dès aujourd'hui ou contactez notre équipe pour une étude personnalisée.", en: "Lock your date today or contact our team for a personalised study." },
  from: { fr: "Dès", en: "From" },
  see_offers: { fr: "Voir les formules", en: "See packages" },
  flagship: { fr: "Formule phare", en: "Flagship package" },
  includes: { fr: "Inclusions", en: "Includes" },
  limits: { fr: "Limites", en: "Limits" },
  popular: { fr: "Le plus réservé", en: "Most booked" },
  on_quote: { fr: "Sur devis", en: "On quote" },
  faq_title: { fr: "Questions fréquentes", en: "FAQ" },
  quote_title: { fr: "Simulateur de devis", en: "Quote simulator" },
  quote_sub: { fr: "4 étapes pour estimer votre prestation en moins d'une minute.", en: "4 steps to estimate your service in under a minute." },
  next: { fr: "Continuer", en: "Continue" },
  back: { fr: "Retour", en: "Back" },
  summary: { fr: "Récapitulatif", en: "Summary" },
  recommended: { fr: "Formule recommandée", en: "Recommended package" },
  signup_title: { fr: "Profitez de réductions exclusives", en: "Enjoy exclusive discounts" },
  signup_text: {
    fr: "Inscrivez-vous gratuitement pour bénéficier des réductions actuelles sur nos produits et services, et recevez nos disponibilités en avant-première.",
    en: "Sign up for free to enjoy current discounts on our products and services, and get priority access to our availability.",
  },
  signup_cta: { fr: "Créer mon compte", en: "Create my account" },
  signup_later: { fr: "Continuer ma visite", en: "Continue browsing" },
  booking_title: { fr: "Réservation & acompte", en: "Booking & deposit" },
  footer_about: {
    fr: "Expert en sonorisation événementielle, vente & installation fixe de matériel audio et studio de production musicale. Lomé, Togo.",
    en: "Expert in event sound reinforcement, audio equipment sales & fixed installation, and music production studio. Lomé, Togo.",
  },
  footer_services: { fr: "Services & liens", en: "Services & links" },
  footer_social: { fr: "Suivez-nous", en: "Follow us" },
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof D | string) => string }>({
  lang: "fr",
  setLang: () => {},
  t: (k) => String(k),
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");
  useEffect(() => {
    const s = store.get("aks_lang") as Lang | null;
    if (s === "en" || s === "fr") setLang(s);
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  const set = (l: Lang) => { store.set("aks_lang", l); setLang(l); };
  const t = (k: string) => (D[k] ? D[k][lang] : k);
  return <Ctx.Provider value={{ lang, setLang: set, t }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
export const L = (v: { fr: string; en: string }, lang: Lang) => v[lang];
