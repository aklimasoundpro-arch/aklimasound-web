"use client";
import { createContext, useContext, useState, ReactNode, FormEvent } from "react";
import { store } from "@/lib/store";
import { CONTACT, waLink } from "@/lib/data";
import { Icon } from "./icons";
import { useI18n } from "@/lib/i18n";
import { track, fbqEvent } from "@/lib/track";

export type Lead = { name: string; phone: string; email: string };
const Ctx = createContext<{ send: (msg: string, to?: string) => void }>({ send: () => {} });
export const useWa = () => useContext(Ctx);

/**
 * Porte d'entrée WhatsApp : numéro principal (+228 97 67 57 64) par défaut ;
 * un autre numéro peut être ciblé (ex. AKLIMASOUND LOGICS → +228 97 82 97 99).
 * Si le visiteur n'est pas connu (pas de fiche capturée / pas connecté),
 * une fenêtre capture nom+prénom, numéro WhatsApp et e-mail AVANT la redirection.
 */
export function WaProvider({ children }: { children: ReactNode }) {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const [pending, setPending] = useState<string | null>(null);
  const [pendingTo, setPendingTo] = useState<string | undefined>(undefined);
  const [err, setErr] = useState("");

  const openWa = (msg: string, lead?: Lead, to?: string) => {
    const full = lead
      ? `${msg}\n---\n${fr ? "Nom" : "Name"} : ${lead.name}\nWhatsApp : ${lead.phone}\nEmail : ${lead.email}`
      : msg;
    track("whatsapp_open", { label: msg.split("\n")[0].slice(0, 100), known: !!lead });
    fbqEvent("Contact");
    window.open(waLink(to || CONTACT.wa1, full), "_blank", "noopener,noreferrer");
  };

  const send = (msg: string, to?: string) => {
    const raw = store.get("aks_lead");
    if (raw) {
      try { openWa(msg, JSON.parse(raw) as Lead, to); return; } catch { /* fiche illisible : recapturer */ }
    }
    setErr("");
    setPending(msg);
    setPendingTo(to);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("website"))) return; // honeypot
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (name.length < 5 || name.split(/\s+/).length < 2) return setErr(fr ? "Merci d'indiquer votre nom et votre prénom." : "Please enter your first and last name.");
    if (!/^[+0-9 ().-]{8,20}$/.test(phone)) return setErr(fr ? "Numéro WhatsApp invalide." : "Invalid WhatsApp number.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setErr(fr ? "Adresse e-mail invalide." : "Invalid email address.");
    const lead: Lead = { name, phone, email };
    store.set("aks_lead", JSON.stringify(lead));
    fetch("/api/public/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, source: "WhatsApp (porte)" }),
    }).catch(() => {}); // silencieux : n'impacte jamais le visiteur
    track("lead_captured", { label: "porte WhatsApp" });
    fbqEvent("Lead");
    const msg = pending ?? "Bonjour Aklimasound !";
    const to = pendingTo;
    setPending(null);
    setPendingTo(undefined);
    openWa(msg, lead, to);
  };

  return (
    <Ctx.Provider value={{ send }}>
      {children}
      {pending !== null && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="fade-in absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setPending(null)} />
          <div className="pop-in glass relative w-full max-w-md rounded-3xl bg-ink-2/95 p-6 sm:p-8">
            <button onClick={() => setPending(null)} aria-label="Fermer" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/60 hover:border-gold hover:text-gold">
              <Icon name="x" className="h-4 w-4" />
            </button>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-wa/40 bg-wa/10 text-wa">
              <Icon name="chat" className="h-6 w-6" />
            </div>
            <h3 className="text-center font-display text-xl font-bold">
              {fr ? "Dernière étape avant WhatsApp" : "One last step before WhatsApp"}
            </h3>
            <p className="mt-2 text-center text-sm text-ivory/65">
              {fr
                ? "Laissez-nous vos coordonnées : nous les joignons à votre message pour vous répondre plus vite (et vous retrouver votre dossier)."
                : "Leave your details: we attach them to your message to answer faster (and keep your file)."}
            </p>
            <form onSubmit={submit} className="mt-5 space-y-3">
              <input className="input" name="name" maxLength={80} placeholder={fr ? "Nom & prénom *" : "First & last name *"} autoFocus />
              <input className="input" name="phone" maxLength={20} placeholder={fr ? "Votre numéro WhatsApp *" : "Your WhatsApp number *"} />
              <input className="input" name="email" type="email" maxLength={120} placeholder={fr ? "Votre e-mail *" : "Your email *"} />
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
              {err && <p className="text-sm text-live">{err}</p>}
              <button type="submit" className="btn btn-wa w-full">
                <Icon name="chat" className="h-4 w-4" /> {fr ? "Continuer vers WhatsApp" : "Continue to WhatsApp"}
              </button>
              <p className="text-center text-[11px] text-ivory/40">
                {fr ? "Vos informations servent uniquement à traiter votre demande." : "Your details are only used to process your request."}
              </p>
            </form>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
