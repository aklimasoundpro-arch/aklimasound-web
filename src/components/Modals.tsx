"use client";
import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { store } from "@/lib/store";
import { CONTACT, fcfa, waLink } from "@/lib/data";
import { Icon } from "./icons";
import { useWa } from "./WaGate";
import { api } from "@/lib/admin-api";
import { PhoneInput } from "./PhoneInput";
import { track, fbqEvent } from "@/lib/track";

function Shell({ open, onClose, children, wide }: { open: boolean; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="fade-in absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`pop-in glass relative max-h-[88vh] w-full overflow-y-auto rounded-3xl bg-ink-2/95 p-6 sm:p-8 ${wide ? "max-w-2xl" : "max-w-md"}`}>
        <button onClick={onClose} aria-label="Fermer" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/60 hover:border-gold hover:text-gold"><Icon name="x" className="h-4 w-4" /></button>
        {children}
      </div>
    </div>
  );
}

/** Pop-up d'inscription (1ère visite, ré-affichable après 7 jours) */
export function SignupModal() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    fetch("/api/public/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((j: { signupPopup?: boolean }) => {
        if (!alive || j.signupPopup !== true) return; // désactivée par défaut + pilotée depuis l'admin
        const seen = store.get("aks_signup_seen");
        if (seen && Date.now() <= Number(seen)) return;
        timer = setTimeout(() => { setOpen(true); track("signup_popup_shown"); }, 1500);
      })
      .catch(() => {});
    return () => { alive = false; if (timer) clearTimeout(timer); };
  }, []);
  const close = (days = 7) => {
    store.set("aks_signup_seen", String(Date.now() + days * 864e5));
    setOpen(false);
  };
  return (
    <Shell open={open} onClose={() => close()}>
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold"><Icon name="gift" className="h-7 w-7" /></div>
        <h2 className="font-display text-2xl font-bold">{t("signup_title")}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ivory/65">{t("signup_text")}</p>
        <Link href="/connexion" onClick={() => { track("signup_cta_click"); close(30); }} className="btn btn-gold mt-6 w-full">{t("signup_cta")}</Link>
        <button onClick={() => close()} className="mt-3 w-full text-center text-sm text-ivory/50 hover:text-ivory">{t("signup_later")}</button>
      </div>
    </Shell>
  );
}

/** Formulaire de devis (pop-up sécurisée : validation client + honeypot) */
export function QuoteModal({ open, onClose, preset, wa }: { open: boolean; onClose: () => void; preset?: string; wa?: string }) {
  const { t, lang } = useI18n();
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  useEffect(() => { if (open) { setSent(false); setErr(""); track("quote_modal_open", { label: preset || "global" }); } }, [open, preset]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("website"))) return; // honeypot anti-bot
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const email = String(fd.get("email") || "").trim();
    if (name.length < 2) return setErr(lang === "fr" ? "Nom invalide." : "Invalid name.");
    if (!/^\+[0-9 ().-]{8,20}$/.test(phone)) return setErr(lang === "fr" ? "Numéro de téléphone invalide." : "Invalid phone number.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setErr(lang === "fr" ? "Adresse e-mail invalide." : "Invalid email address.");
    if (name.split(/\s+/).length >= 2 && email) store.set("aks_lead", JSON.stringify({ name, phone, email }));
    api.pub("quotes", {
      name, phone, email, offer: preset || String(fd.get("offer") || ""),
      date: String(fd.get("date") || ""), place: String(fd.get("place") || ""),
      msg: String(fd.get("msg") || ""), source: "formulaire",
    }); // enregistrement admin (devis → /admin/devis), silencieux si hors-ligne
    track("quote_sent", { label: preset || String(fd.get("offer") || "global") });
    fbqEvent("Lead");
    const msg =
      `Bonjour Aklimasound, demande de devis :\n` +
      `• Nom : ${name}\n• Tél : ${phone}\n• Email : ${email || "-"}\n` +
      `• Formule : ${preset || fd.get("offer")}\n` +
      `• Date : ${fd.get("date") || "à définir"}\n• Lieu : ${fd.get("place") || "-"}\n` +
      `• Message : ${fd.get("msg") || "-"}`;
    window.open(waLink(wa || CONTACT.wa1, msg), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <Shell open={open} onClose={onClose} wide>
      {sent ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-wa/40 bg-wa/10 text-wa"><Icon name="check" className="h-7 w-7" /></div>
          <h3 className="font-display text-xl font-bold">{lang === "fr" ? "Demande prête !" : "Request ready!"}</h3>
          <p className="mt-2 text-sm text-ivory/65">
            {lang === "fr"
              ? "WhatsApp s'ouvre avec votre demande pré-remplie. Notre équipe répond en moins de 2 h ouvrées."
              : "WhatsApp opens with your prefilled request. Our team replies within 2 business hours."}
          </p>
          <button onClick={onClose} className="btn btn-outline mt-6">{lang === "fr" ? "Fermer" : "Close"}</button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <h3 className="font-display text-2xl font-bold">{t("cta_quote")}</h3>
          <p className="text-sm text-ivory/60">{lang === "fr" ? "Réponse rapide sur WhatsApp ou par e-mail. Aucune donnée bancaire demandée." : "Fast reply on WhatsApp or by email. No banking data requested."}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input" name="name" placeholder={lang === "fr" ? "Nom complet *" : "Full name *"} maxLength={80} />
            <PhoneInput />
          </div>
          <input className="input" name="email" type="email" placeholder={lang === "fr" ? "E-mail (recommandé)" : "Email (recommended)"} maxLength={120} />
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input" name="date" type="date" />
            <input className="input" name="place" placeholder={lang === "fr" ? "Lieu (ville / quartier)" : "Location (city / area)"} maxLength={80} />
          </div>
          {preset ? (
            <p className="chip">{preset}</p>
          ) : (
            <select className="input" name="offer" defaultValue="">
              <option value="" className="bg-ink">{lang === "fr" ? "Formule souhaitée (optionnel)" : "Desired package (optional)"}</option>
              <option className="bg-ink" value="À conseiller">À conseiller</option>
            </select>
          )}
          <textarea className="input" name="msg" rows={3} placeholder={lang === "fr" ? "Décrivez votre événement…" : "Tell us about your event…"} maxLength={600} />
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
          {err && <p className="text-sm text-live">{err}</p>}
          <button type="submit" className="btn btn-gold w-full">{lang === "fr" ? "Envoyer ma demande" : "Send my request"}</button>
        </form>
      )}
    </Shell>
  );
}

/** Réservation : demande simple — confirmation après échange, aucun paiement en ligne. */
export function BookingModal({ open, onClose, offer }: { open: boolean; onClose: () => void; offer?: { name: string; price: number | null } }) {
  const { lang } = useI18n();
  const { send } = useWa();
  const [sent, setSent] = useState<string | null>(null);
  useEffect(() => { if (open) track("booking_modal_open", { label: offer?.name || "" }); }, [open, offer?.name]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("website"))) return; // honeypot anti-robots
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    if (name.length < 2 || !/^\+[0-9 ().-]{8,20}$/.test(phone)) return setSent("err");
    api.pub("bookings", {
      customer: name, phone, offer: offer?.name ?? "", total: offer?.price ?? 0,
      depositRate: 0, proofRef: "",
      date: String(fd.get("date") || ""), place: String(fd.get("place") || ""), channel: "site",
    });
    store.set("aks_lead", JSON.stringify({ name, phone, email: String(fd.get("email") || "") }));
    setSent("ok");
    track("booking_request", { label: offer?.name || "" });
  };

  return (
    <Shell open={open} onClose={onClose}>
      <h3 className="font-display text-2xl font-bold">{lang === "fr" ? "Réservation" : "Booking"}</h3>
      {offer && (
        <p className="mt-2 text-sm text-ivory/70">
          {offer.name} — <span className="text-gold font-semibold">{offer.price ? fcfa(offer.price) : (lang === "fr" ? "sur devis" : "on quote")}</span>
        </p>
      )}
      <ol className="mt-5 space-y-3 text-sm text-ivory/75">
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">1</span>
          {lang === "fr" ? "Décrivez votre événement ci-dessous : la demande part directement dans notre espace de gestion." : "Describe your event below: the request goes straight to our management space."}</li>
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">2</span>
          {lang === "fr" ? "Nous vérifions la disponibilité de la date et revenons vers vous pour convenir ensemble des modalités." : "We check the date availability and get back to you to agree on the arrangements together."}</li>
        <li className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-xs font-bold text-gold">3</span>
          {lang === "fr" ? "Votre date est bloquée dès confirmation conjointe." : "Your date is locked as soon as both parties confirm."}</li>
      </ol>
      {sent === "ok" ? (
        <p className="mt-4 rounded-2xl border border-[#3ecf8e]/30 bg-[#3ecf8e]/10 p-3 text-center text-sm text-[#3ecf8e]">
          {lang === "fr" ? "✓ Demande envoyée ! Notre équipe vous contacte très vite pour confirmer votre date." : "✓ Request sent! Our team will contact you shortly to confirm your date."}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-4 space-y-2.5">
          <input className="input !py-2 text-sm" name="name" maxLength={80} placeholder={lang === "fr" ? "Nom / organisation *" : "Name / organization *"} />
          <PhoneInput compact />
          <input className="input !py-2 text-sm" name="email" type="email" maxLength={120} placeholder={lang === "fr" ? "E-mail (optionnel)" : "Email (optional)"} />
          <div className="grid grid-cols-2 gap-2.5">
            <input className="input !py-2 text-sm" name="date" type="date" aria-label={lang === "fr" ? "Date souhaitée" : "Desired date"} />
            <input className="input !py-2 text-sm" name="place" maxLength={80} placeholder={lang === "fr" ? "Lieu" : "Location"} />
          </div>
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
          {sent === "err" && <p className="text-xs text-live">{lang === "fr" ? "Nom (2 car. min.) et téléphone international valide requis." : "Name (min 2 chars) and valid international phone required."}</p>}
          <button className="btn btn-gold w-full !py-2.5 text-sm"><Icon name="zap" className="h-4 w-4" /> {lang === "fr" ? "Envoyer ma demande" : "Send my request"}</button>
        </form>
      )}
      <button onClick={() => send(`Bonjour Aklimasound, je souhaite réserver l'offre ${offer?.name ?? ""} pour mon événement.`)} className="btn btn-wa mt-3 w-full">
        <Icon name="chat" className="h-4 w-4" /> {lang === "fr" ? "Discuter d'abord sur WhatsApp" : "Chat on WhatsApp first"}</button>
    </Shell>
  );
}
