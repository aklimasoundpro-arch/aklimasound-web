"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "./icons";
import { useI18n } from "@/lib/i18n";
import { getConsent, hasStoredConsent, setConsent } from "@/lib/track";

/**
 * Bandeau de gestion des cookies.
 * - Mesure d'audience : 1re partie, anonyme, active par défaut mais opposable (« Refuser »).
 * - Marketing (Meta Pixel) : désactivé tant que non accepté explicitement.
 * Ré-ouvrable à tout moment via le lien « Cookies » du pied de page.
 */
export function CookieBanner() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (!hasStoredConsent()) {
      const id = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(id);
    }
  }, []);

  useEffect(() => {
    const manage = () => {
      const c = getConsent();
      setAnalytics(c.analytics);
      setMarketing(c.marketing);
      setCustom(false);
      setVisible(true);
    };
    const done = () => setVisible(false);
    window.addEventListener("aks-cookie-manage", manage);
    window.addEventListener("aks-consent", done);
    return () => {
      window.removeEventListener("aks-cookie-manage", manage);
      window.removeEventListener("aks-consent", done);
    };
  }, []);

  if (!visible) return null;

  const save = (a: boolean, m: boolean) => {
    setConsent({ analytics: a, marketing: m });
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[85] p-3 sm:p-4">
      <div className="pop-in glass mx-auto max-w-3xl rounded-3xl border-gold/25 bg-ink-2/95 p-5 shadow-2xl sm:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold"><Icon name="gift" className="h-4 w-4" /></span>
          <div className="flex-1">
            <h2 className="font-display text-base font-bold">{fr ? "Cookies & mesure d'audience" : "Cookies & audience measurement"}</h2>
            <p className="mt-1.5 text-xs leading-relaxed text-ivory/60">
              {fr
                ? "Nous utilisons des traceurs strictement nécessaires au service, une mesure d'audience anonyme faite par nous-mêmes (aucun tiers), et — seulement si vous l'acceptez — le pixel Meta pour nos publicités. "
                : "We use traceurs strictly necessary to the service, anonymous first-party audience measurement (no third party), and — only if you accept — the Meta pixel for our ads. "}
              <Link href="/legal/cookies" className="text-gold underline-offset-2 hover:underline">{fr ? "Politique de cookies" : "Cookie policy"}</Link>
              {" · "}
              <Link href="/legal/confidentialite" className="text-gold underline-offset-2 hover:underline">{fr ? "Confidentialité" : "Privacy"}</Link>.
            </p>

            {custom && (
              <div className="mt-3 space-y-2">
                <label className="flex items-center justify-between gap-3 rounded-xl border border-ivory/10 bg-white/[0.03] px-3 py-2 text-xs">
                  <span className="text-ivory/75">{fr ? "Mesure d'audience anonyme (recommandé)" : "Anonymous audience measurement (recommended)"}</span>
                  <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="h-4 w-4 accent-[#e9c87e]" />
                </label>
                <label className="flex items-center justify-between gap-3 rounded-xl border border-ivory/10 bg-white/[0.03] px-3 py-2 text-xs">
                  <span className="text-ivory/75">{fr ? "Publicité Meta (Facebook / Instagram)" : "Meta advertising (Facebook / Instagram)"}</span>
                  <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="h-4 w-4 accent-[#e9c87e]" />
                </label>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {custom ? (
                <>
                  <button onClick={() => save(analytics, marketing)} className="btn btn-gold !py-2 !px-4 text-xs">{fr ? "Enregistrer mes choix" : "Save my choices"}</button>
                  <button onClick={() => setCustom(false)} className="btn btn-outline !py-2 !px-4 text-xs">{fr ? "Retour" : "Back"}</button>
                </>
              ) : (
                <>
                  <button onClick={() => save(true, true)} className="btn btn-gold !py-2 !px-4 text-xs" data-track="cookie_consent" data-label="accept-all">{fr ? "Tout accepter" : "Accept all"}</button>
                  <button onClick={() => save(false, false)} className="btn btn-outline !py-2 !px-4 text-xs" data-track="cookie_consent" data-label="refuse">{fr ? "Refuser" : "Refuse"}</button>
                  <button onClick={() => setCustom(true)} className="btn btn-outline !py-2 !px-4 text-xs" data-track="cookie_consent" data-label="customize">{fr ? "Personnaliser" : "Customize"}</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
