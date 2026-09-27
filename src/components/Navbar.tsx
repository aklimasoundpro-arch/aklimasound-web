"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DOMAINS, CONTACT, waLink } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { Icon } from "./icons";
import { useWa } from "./WaGate";
import { useMember } from "@/lib/member";

export default function Navbar({ onQuote }: { onQuote: () => void }) {
  const { t, lang, setLang } = useI18n();
  const { send } = useWa();
  const { connected } = useMember();
  const [open, setOpen] = useState(false);
  const [svc, setSvc] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => { setOpen(false); setSvc(false); }, [path]);

  const links = [
    { href: "/materiel", label: t("nav_materiel") },
    { href: "/logics", label: t("nav_logics") },
    { href: "/galerie", label: t("nav_galerie") },
    { href: "/devis", label: t("nav_devis") },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "bg-ink/85 backdrop-blur-xl border-b border-ivory/10" : "bg-transparent"}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3">
        <Link href="/" className="flex items-center gap-3 group" aria-label="Aklimasound — accueil">
          <Image
            src="/img/logo-aks-white.png"
            alt="Aklimasound — la passion du son"
            width={1254}
            height={1254}
            className="h-12 w-12 object-contain transition group-hover:drop-shadow-[0_0_12px_rgba(233,200,126,.55)]"
            priority
          />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          <div className="relative" onMouseEnter={() => setSvc(true)} onMouseLeave={() => setSvc(false)}>
            <button onClick={() => setSvc((v) => !v)} aria-expanded={svc} className="rounded-full px-4 py-2 text-sm text-ivory/80 hover:text-gold transition-colors">
              {t("nav_services")} <span className={`inline-block transition-transform ${svc ? "rotate-180" : ""}`}>▾</span>
            </button>
            {svc && (
              <div className="absolute left-0 top-full w-64 rounded-2xl border border-ivory/10 bg-ink-2/95 p-2 backdrop-blur-xl shadow-2xl">
                {DOMAINS.map((d) => (
                  <Link key={d.slug} href={`/services/${d.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ivory/85 hover:bg-gold/10 hover:text-gold">
                    <Icon name={d.icon} className="h-4 w-4 text-gold/70" /> {d.name[lang]}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-4 py-2 text-sm text-ivory/80 hover:text-gold transition-colors">{l.label}</Link>
          ))}
          <button className="rounded-full px-4 py-2 text-sm text-ivory/50 hover:text-gold inline-flex items-center gap-2" title="Beatstore — phase 2">
            <Icon name="headphones" className="h-4 w-4" /> {t("nav_beatstore")} <span className="chip !py-0 !text-[9px]">Bientôt</span>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <div className="flex rounded-full border border-ivory/15 p-0.5 text-xs font-semibold">
            {(["fr", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} className={`rounded-full px-2.5 py-1 uppercase transition ${lang === l ? "bg-gold text-black" : "text-ivory/60 hover:text-ivory"}`}>{l}</button>
            ))}
          </div>
          <Link href={connected ? "/compte" : "/connexion"} className="text-sm text-ivory/70 hover:text-gold">{connected ? (lang === "fr" ? "Mon compte" : "My account") : t("nav_login")}</Link>
          <button onClick={onQuote} className="btn btn-gold !py-2.5 !px-5 text-sm">{t("cta_quote")}</button>
        </div>

        <button className="lg:hidden flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-lg border border-ivory/15" onClick={() => setOpen(!open)} aria-label="Menu">
          <span className={`h-0.5 w-5 bg-ivory transition ${open ? "translate-y-1 rotate-45" : ""}`} />
          <span className={`h-0.5 w-5 bg-ivory transition ${open ? "-translate-y-1 -rotate-45" : ""}`} />
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-ivory/10 bg-ink/95 backdrop-blur-xl px-4 pb-6 pt-3 max-h-[80vh] overflow-y-auto">
          <p className="px-2 py-1 text-xs uppercase tracking-widest text-gold/70">{t("nav_services")}</p>
          {DOMAINS.map((d) => (
            <Link key={d.slug} href={`/services/${d.slug}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ivory/90 hover:bg-gold/10">
              <Icon name={d.icon} className="h-4 w-4 text-gold/70" /> {d.name[lang]}
            </Link>
          ))}
          <div className="my-2 h-px bg-ivory/10" />
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block rounded-xl px-3 py-2.5 text-sm text-ivory/90 hover:bg-gold/10">{l.label}</Link>
          ))}
          <Link href={connected ? "/compte" : "/connexion"} className="block rounded-xl px-3 py-2.5 text-sm text-ivory/90 hover:bg-gold/10">{connected ? (lang === "fr" ? "Mon compte" : "My account") : t("nav_login")}</Link>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex rounded-full border border-ivory/15 p-0.5 text-xs font-semibold">
              {(["fr", "en"] as const).map((l) => (
                <button key={l} onClick={() => setLang(l)} className={`rounded-full px-3 py-1.5 uppercase ${lang === l ? "bg-gold text-black" : "text-ivory/60"}`}>{l}</button>
              ))}
            </div>
            <button onClick={() => send("Bonjour Aklimasound !")} className="btn btn-wa flex-1 !py-2.5 text-sm">
              <Icon name="chat" className="h-4 w-4" /> WhatsApp
            </button>
          </div>
          <button onClick={onQuote} className="btn btn-gold mt-3 w-full">{t("cta_quote")}</button>
        </div>
      )}
    </header>
  );
}
