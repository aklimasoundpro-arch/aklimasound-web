import Link from "next/link";
import Image from "next/image";
import { CONTACT, DOMAINS } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { Icon } from "./icons";

export default function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="relative border-t border-ivory/10 bg-ink-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-4">
            <Image src="/img/logo-aks-white.png" alt="Aklimasound" width={1254} height={1254} className="h-16 w-16 object-contain" />
            <div>
              <p className="font-display text-xl font-bold tracking-[0.16em]">AKLIMASOUND PRO</p>
              <p className="text-xs text-gold/80">Sonorisation • Vente & Installation • Beatstore</p>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/60">{t("footer_about")}</p>
          <p className="mt-3 text-sm text-ivory/60">{CONTACT.city[lang]} — <a className="hover:text-gold" data-track="email_click" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
          <div className="mt-2 space-y-1 text-sm">
            {CONTACT.phones.map((p) => (
              <a key={p.tel} href={`tel:${p.tel}`} data-track="phone_click" data-label={p.tel} className="flex items-center gap-2 text-ivory/70 transition hover:text-gold">
                <Icon name="phone" className="h-3.5 w-3.5 text-gold/70" /> {p.display}
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">{t("footer_services")}</p>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><Link className="hover:text-gold" href="/services/concert-chorale">Sonorisation événementielle</Link></li>
            <li><Link className="hover:text-gold" href="/materiel">Vente & installation matériel</Link></li>
            <li><span className="opacity-60">Beatstore & licences — bientôt</span></li>
            <li><Link className="hover:text-gold" href="/galerie">Galerie réalisations</Link></li>
            <li><Link className="hover:text-gold" href="/devis">Devis en ligne</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">{t("footer_social")}</p>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li>
              <a className="inline-flex items-center gap-2 hover:text-gold" data-track="social_click" data-label="tiktok" href={CONTACT.tiktok} target="_blank" rel="noopener">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ivory/15 bg-white/5"><Icon name="music" className="h-4 w-4" /></span>
                TikTok — @aklimasoundpro
              </a>
            </li>
            <li>
              <a className="inline-flex items-center gap-2 hover:text-gold" data-track="social_click" data-label="instagram" href={CONTACT.instagram} target="_blank" rel="noopener">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-ivory/15 bg-white/5"><Icon name="instagram" className="h-4 w-4" /></span>
                Instagram — @aklimasoundpro
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs uppercase tracking-widest text-ivory/40">Domaines</p>
          <p className="mt-1 text-xs text-ivory/50">{DOMAINS.map((d) => d.name[lang]).join(" · ")}</p>
        </div>
      </div>
      <div className="border-t border-ivory/10 px-6 py-4 text-center text-xs text-ivory/45">
        © 2026 Aklimasound. Tous droits réservés. — Designed & Developed by <span className="text-gold/80">COGNYAX DIGITAL</span>
      </div>
    </footer>
  );
}
