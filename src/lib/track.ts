/**
 * Tracking 1re partie (aucun cookie tiers) : identifiant visiteur anonyme,
 * capture des UTM (pubs Facebook/Google/TikTok) et envoi d'événements.
 * Silencieux par design : n'impacte jamais le visiteur en cas d'échec.
 */
import { store } from "./store";

const VID_KEY = "aks_vid";
const UTM_KEY = "aks_utm";
const CONSENT_KEY = "aks_cookie_consent";
const CONSENT_TTL = 183 * 864e5; // 6 mois
const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];

export type Consent = { analytics: boolean; marketing: boolean; date?: string };

/** Consentement courant. Par défaut : mesure d'audience anonyme 1re partie ON
 *  (exemptée de consentement, opposable via le bandeau), marketing OFF. */
export function getConsent(): Consent {
  try {
    const raw = store.get(CONSENT_KEY);
    if (raw) {
      const c = JSON.parse(raw) as Consent;
      if (c.date && Date.now() - new Date(c.date).getTime() > CONSENT_TTL) return { analytics: true, marketing: false };
      return { analytics: c.analytics !== false, marketing: c.marketing === true };
    }
  } catch { /* choix illisible : défaut prudent */ }
  return { analytics: true, marketing: false };
}

export function hasStoredConsent(): boolean {
  try {
    const raw = store.get(CONSENT_KEY);
    if (!raw) return false;
    const c = JSON.parse(raw) as Consent;
    return !!c.date && Date.now() - new Date(c.date).getTime() <= CONSENT_TTL;
  } catch {
    return false;
  }
}

export function setConsent(c: { analytics: boolean; marketing: boolean }) {
  store.set(CONSENT_KEY, JSON.stringify({ ...c, date: new Date().toISOString() }));
  try { window.dispatchEvent(new Event("aks-consent")); } catch { /* sans effet */ }
}

export function visitorId(): string {
  let v = store.get(VID_KEY);
  if (!v) {
    v = Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    store.set(VID_KEY, v);
  }
  return v;
}

/** Lit les UTM de l'URL courante et les mémorise pour toute la session. */
export function captureUtm(): Record<string, string> | null {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  const found: Record<string, string> = {};
  for (const k of UTM_PARAMS) {
    const v = p.get(k);
    if (v) found[k] = v.slice(0, 80);
  }
  const prev = store.get(UTM_KEY);
  const merged = Object.keys(found).length ? found : prev ? (JSON.parse(prev) as Record<string, string>) : null;
  if (Object.keys(found).length) store.set(UTM_KEY, JSON.stringify(found));
  return merged;
}

export function currentUtm(): Record<string, string> | null {
  const raw = store.get(UTM_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as Record<string, string>; } catch { return null; }
}

export function track(event: string, data: Record<string, unknown> = {}) {
  try {
    if (typeof window === "undefined") return;
    if (!getConsent().analytics) return; // visiteur opposé à la mesure d'audience
    fetch("/api/public/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        event,
        vid: visitorId(),
        page: window.location.pathname,
        ref: document.referrer || undefined,
        utm: currentUtm() ?? undefined,
        lang: document.documentElement.lang || "fr",
        ...data,
      }),
    }).catch(() => {});
  } catch { /* jamais bloquant */ }
}

/** Événement standard Meta Pixel (actif seulement si NEXT_PUBLIC_META_PIXEL_ID est défini). */
export function fbqEvent(name: "Lead" | "Contact" | "InitiateCheckout" | "Purchase") {
  try {
    const w = window as unknown as { fbq?: (action: string, name: string) => void };
    if (typeof w.fbq === "function") w.fbq("track", name);
  } catch { /* pixel non chargé */ }
}
