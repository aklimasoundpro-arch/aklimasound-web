"use client";
import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QuoteModal } from "@/components/Modals";
import { Reveal } from "@/components/motion";
import { SectionHead } from "@/components/ui";
import { Icon } from "@/components/icons";
import { useWa } from "@/components/WaGate";
import { DOMAINS, CONTACT, waLink, fcfa } from "@/lib/data";
import { useI18n, L } from "@/lib/i18n";
import { store } from "@/lib/store";
import { api } from "@/lib/admin-api";

const OPTIONS = [
  { id: "lumiere", price: 40000, label: { fr: "Pack lumières (PAR LED / lyres)", en: "Lighting pack (PAR LED / moving heads)" } },
  { id: "dj", price: 60000, label: { fr: "DJ / animateur partenaire", en: "Partner DJ / host" } },
  { id: "captation", price: 80000, label: { fr: "Captation audio multi-pistes", en: "Multitrack audio recording" } },
  { id: "groupe", price: 70000, label: { fr: "Groupe électrogène de secours", en: "Backup generator" } },
  { id: "transport", price: 30000, label: { fr: "Déplacement longue distance (hors zone urbaine)", en: "Long-distance travel (outside urban area)" } },
];

export default function Devis() {
  const { t, lang } = useI18n();
  const { send } = useWa();
  const [step, setStep] = useState(1);
  const [domain, setDomain] = useState<string>("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [guests, setGuests] = useState(150);
  const [outdoor, setOutdoor] = useState(false);
  const [opts, setOpts] = useState<string[]>([]);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const d = DOMAINS.find((x) => x.slug === domain);
  const rec = useMemo(() => {
    if (!d) return null;
    return d.offers.find((o) => o.cap >= guests) ?? d.offers[d.offers.length - 1];
  }, [d, guests]);
  const total = useMemo(() => {
    if (!rec) return 0;
    return (rec.price ?? 1000000) + opts.reduce((s, id) => s + (OPTIONS.find((o) => o.id === id)?.price ?? 0), 0);
  }, [rec, opts]);

  const summaryMsg =
    `Bonjour Aklimasound, estimation simulateur :\n` +
    `• Domaine : ${d ? d.name.fr : "-"}\n• Date : ${date || "à définir"}\n• Lieu : ${place || "-"}\n` +
    `• Jauge : ${guests} pers. (${outdoor ? "extérieur" : "intérieur"})\n` +
    `• Options : ${opts.map((o) => OPTIONS.find((x) => x.id === o)?.label.fr).join(", ") || "aucune"}\n` +
    `• Formule recommandée : ${rec?.name} — estimation ${fcfa(total)}`;

  const Step = ({ n, label }: { n: number; label: string }) => (
    <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${step >= n ? "text-gold" : "text-ivory/35"}`}>
      <span className={`flex h-7 w-7 items-center justify-center rounded-full border ${step >= n ? "border-gold bg-gold/15" : "border-ivory/20"}`}>{n}</span>
      {label}
    </div>
  );

  return (
    <>
      <Navbar onQuote={() => setQuoteOpen(true)} />
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} preset={rec?.name} />
      <section className="mx-auto max-w-4xl px-6 pb-24 pt-32">
        <SectionHead center kicker="Simulateur" title={t("quote_title")} sub={t("quote_sub")} />
        <Reveal>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Step n={1} label={lang === "fr" ? "Domaine" : "Field"} />
            <Step n={2} label={lang === "fr" ? "Événement" : "Event"} />
            <Step n={3} label={lang === "fr" ? "Options" : "Options"} />
            <Step n={4} label={t("summary")} />
          </div>
          <div className="glass mt-8 rounded-3xl p-6 sm:p-8">
            {step === 1 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {DOMAINS.map((x) => (
                  <button key={x.slug} data-track="simulator_domain" data-label={x.slug} onClick={() => { setDomain(x.slug); setStep(2); }}
                    className={`glass card-hover flex items-center gap-3 rounded-2xl p-4 text-left ${domain === x.slug ? "border-gold/60" : ""}`}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-ivory/12 bg-white/[0.04] text-gold"><Icon name={x.icon} className="h-4 w-4" /></span>
                    <span className="text-sm font-semibold">{L(x.name, lang)}</span>
                  </button>
                ))}
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  <input className="input" placeholder={lang === "fr" ? "Ville / quartier *" : "City / area *"} value={place} onChange={(e) => setPlace(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm text-ivory/70">{lang === "fr" ? "Nombre de personnes estimées" : "Estimated number of guests"} : <b className="text-gold">{guests}</b></label>
                  <input type="range" min={30} max={2500} step={10} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="mt-2 w-full accent-[#e9c87e]" />
                </div>
                <label className="flex items-center gap-3 text-sm text-ivory/75">
                  <input type="checkbox" checked={outdoor} onChange={(e) => setOutdoor(e.target.checked)} className="h-4 w-4 accent-[#e9c87e]" />
                  {lang === "fr" ? "Événement en plein air" : "Open-air event"}
                </label>
                <div className="flex justify-between pt-2">
                  <button className="btn btn-outline" onClick={() => setStep(1)}>{t("back")}</button>
                  <button className="btn btn-gold" data-track="simulator_step" data-label="3-options" onClick={() => setStep(3)} disabled={!domain}>{t("next")}</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-3">
                {OPTIONS.map((o) => (
                  <label key={o.id} className="glass flex cursor-pointer items-center justify-between rounded-2xl p-4">
                    <span className="flex items-center gap-3 text-sm">
                      <input type="checkbox" checked={opts.includes(o.id)} className="h-4 w-4 accent-[#e9c87e]"
                        onChange={(e) => setOpts(e.target.checked ? [...opts, o.id] : opts.filter((x) => x !== o.id))} />
                      {L(o.label, lang)}
                    </span>
                    <span className="text-xs font-semibold text-gold">+ {fcfa(o.price)}</span>
                  </label>
                ))}
                <div className="flex justify-between pt-2">
                  <button className="btn btn-outline" onClick={() => setStep(2)}>{t("back")}</button>
                  <button className="btn btn-gold" data-track="simulator_step" data-label="4-resume" onClick={() => setStep(4)}>{t("next")}</button>
                </div>
              </div>
            )}
            {step === 4 && rec && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-gold/50 bg-gold/10 p-5">
                  <p className="text-xs uppercase tracking-widest text-gold/80">{t("recommended")}</p>
                  <p className="mt-1 font-display text-2xl font-bold">{rec.name}</p>
                  <p className="mt-1 text-sm text-ivory/70">{L(rec.includes, lang)}</p>
                  <p className="mt-3 font-display text-xl font-bold text-gradient-gold">{fcfa(total)}</p>
                  <p className="mt-1 text-[11px] text-ivory/50">{lang === "fr" ? "Estimation non contractuelle, frais Mobile Money inclus. Acompte 30 % ou 50 %." : "Non-binding estimate, Mobile Money fees included. 30% or 50% deposit."}</p>
                </div>
                <ul className="space-y-1 text-sm text-ivory/70">
                  <li>• {L(d!.name, lang)} — {date || (lang === "fr" ? "date à définir" : "date TBD")} — {place || "—"}</li>
                  <li>• {guests} {lang === "fr" ? "personnes" : "guests"} ({outdoor ? (lang === "fr" ? "plein air" : "open air") : (lang === "fr" ? "intérieur" : "indoor")})</li>
                  <li>• {lang === "fr" ? "Options" : "Options"} : {opts.length ? opts.map((o) => L(OPTIONS.find((x) => x.id === o)!.label, lang)).join(", ") : "—"}</li>
                </ul>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button onClick={() => {
                    // Enregistre l'estimation dans l'admin si le visiteur est connu (porte WhatsApp passée)
                    try {
                      const l = JSON.parse(store.get("aks_lead") || "null") as { name: string; phone: string; email: string } | null;
                      if (l?.name) api.pub("quotes", {
                        name: l.name, phone: l.phone, email: l.email,
                        domain: d?.name.fr ?? "", offer: rec?.name ?? "", date, place, total,
                        source: "simulateur", msg: `${guests} pers. (${outdoor ? "extérieur" : "intérieur"}) — options : ${opts.map((o) => OPTIONS.find((x) => x.id === o)?.label.fr).join(", ") || "aucune"}`,
                      });
                    } catch { /* fiche illisible : on envoie quand même vers WhatsApp */ }
                    send(summaryMsg);
                  }} className="btn btn-wa"><Icon name="chat" className="h-4 w-4" /> {t("cwa")}</button>
                  <button className="btn btn-gold" onClick={() => setQuoteOpen(true)}><Icon name="file" className="h-4 w-4" /> {t("cta_quote")}</button>
                </div>
                <button className="btn btn-outline w-full" onClick={() => setStep(3)}>{t("back")}</button>
              </div>
            )}
          </div>
        </Reveal>
      </section>
      <Footer />
    </>
  );
}
