"use client";
import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { QuoteModal } from "@/components/Modals";
import { Reveal } from "@/components/motion";
import { Icon, IconTile } from "@/components/icons";
import { useWa } from "@/components/WaGate";
import { useI18n } from "@/lib/i18n";
import { track } from "@/lib/track";

const FEATURES = [
  { icon: "sliders", t: { fr: "Multiconsole par IA", en: "AI multi-console" }, d: { fr: "Pilotez plusieurs consoles numériques simultanément depuis une seule interface unifiée.", en: "Drive several digital consoles simultaneously from one unified interface." } },
  { icon: "zap", t: { fr: "Auto-mix intelligent", en: "Intelligent auto-mix" }, d: { fr: "Gains, égalisation et détection de larsen ajustés en temps réel par l'IA.", en: "Gains, EQ and feedback detection adjusted in real time by AI." } },
  { icon: "phone", t: { fr: "Contrôle à distance", en: "Remote control" }, d: { fr: "Réglez le son depuis tablette, téléphone ou PC — sur site ou à distance.", en: "Adjust sound from tablet, phone or PC — on site or remotely." } },
  { icon: "package", t: { fr: "Scènes dans le cloud", en: "Cloud scenes" }, d: { fr: "Sauvegardez et rappelez scènes et profils par lieu, événement ou équipe.", en: "Save and recall scenes and profiles per venue, event or team." } },
  { icon: "camera", t: { fr: "Supervision live", en: "Live supervision" }, d: { fr: "Vumètres, alertes et journal détaillé de chaque session en direct.", en: "Meters, alerts and detailed log of every session, live." } },
  { icon: "badge", t: { fr: "SaaS sans installation", en: "SaaS, no install" }, d: { fr: "Abonnement par poste, mises à jour continues incluses, aucun serveur à gérer.", en: "Per-seat subscription, continuous updates included, no server to manage." } },
];

const AUDIENCE = [
  { fr: "Ingénieurs du son & régisseurs", en: "Sound engineers & stage managers" },
  { fr: "Églises & lieux de culte", en: "Churches & worship venues" },
  { fr: "Salles, hôtels & espaces conférences", en: "Halls, hotels & conference spaces" },
  { fr: "Prestataires & loueurs de matériel", en: "Service providers & rental companies" },
];

export default function LogicsView() {
  const { lang } = useI18n();
  const { send } = useWa();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const fr = lang === "fr";

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("website"))) return;
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    if (name.length < 2 || (!email && !phone)) return setState("error");
    setState("sending");
    fetch("/api/public/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, email, phone: phone || email,
        source: `LOGICS — accès anticipé (${String(fd.get("profile") || "-")})`,
      }),
    })
      .then(() => { track("logics_waitlist", { label: String(fd.get("profile") || "") }); setState("done"); })
      .catch(() => setState("error"));
  };

  return (
    <>
      <Navbar onQuote={() => setOpen(true)} />
      <QuoteModal open={open} onClose={() => setOpen(false)} preset="AKLIMASOUND LOGICS" />

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden pb-20 pt-36">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(ellipse at 50% -20%, var(--color-gold), transparent 55%)" }} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <span className="chip mx-auto"><Icon name="zap" className="h-3.5 w-3.5" /> {fr ? "En développement — accès anticipé ouvert" : "In development — early access open"}</span>
            <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.5em] text-gold">Aklimasound Logics</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {fr ? "Le contrôle par IA de vos consoles numériques" : "AI-powered control of your digital consoles"}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ivory/65">
              {fr
                ? "Un logiciel SaaS qui pilote plusieurs consoles de mixage numériques depuis une seule interface, avec une assistance IA en temps réel : auto-mix, anti-larsen, scènes cloud et supervision à distance. Conçu sur le terrain, par des ingénieurs du son."
                : "A SaaS software that drives multiple digital mixing consoles from a single interface, with real-time AI assistance: auto-mix, feedback control, cloud scenes and remote supervision. Built in the field, by sound engineers."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#acces" className="btn btn-gold" data-track="logics_cta" data-label="accès anticipé"><Icon name="badge" className="h-4 w-4" /> {fr ? "Rejoindre l'accès anticipé" : "Join early access"}</a>
              <button onClick={() => send(fr ? "Bonjour Aklimasound, je souhaite des informations sur le logiciel AKLIMASOUND LOGICS (contrôle IA multiconsole)." : "Hello Aklimasound, I would like information about the AKLIMASOUND LOGICS software (AI multi-console control).")} className="btn btn-wa" data-track="logics_cta" data-label="whatsapp">
                <Icon name="chat" className="h-4 w-4" /> {fr ? "Parler du produit" : "Talk about the product"}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Fonctionnalités ---- */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="glass card-hover h-full rounded-3xl p-6">
                <IconTile name={f.icon} />
                <h3 className="mt-4 font-display font-bold">{f.t[lang]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ivory/60">{f.d[lang]}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- Pour qui ---- */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        <Reveal>
          <div className="glass rounded-3xl p-8">
            <h2 className="text-center font-display text-2xl font-bold">{fr ? "Conçu pour" : "Built for"}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {AUDIENCE.map((a, i) => (
                <p key={i} className="flex items-center gap-3 rounded-2xl border border-ivory/10 bg-white/[0.03] px-4 py-3 text-sm text-ivory/75">
                  <Icon name="check" className="h-4 w-4 shrink-0 text-gold" /> {a[lang]}
                </p>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-ivory/45">
              {fr ? "Tarification SaaS à l'annonce de la version commerciale — les inscrits à l'accès anticipé bénéficient d'un tarif fondateur." : "SaaS pricing announced at commercial launch — early access members get a founding-member rate."}
            </p>
          </div>
        </Reveal>
      </section>

      {/* ---- Accès anticipé ---- */}
      <section id="acces" className="mx-auto max-w-2xl px-6 pb-24 pt-10">
        <Reveal>
          <div className="glass rounded-3xl border-gold/30 p-8">
            <h2 className="text-center font-display text-2xl font-bold">{fr ? "Accès anticipé" : "Early access"}</h2>
            <p className="mt-2 text-center text-sm text-ivory/60">
              {fr ? "Laissez vos coordonnées : vous serez parmi les premiers à tester la bêta privée et à recevoir le tarif fondateur." : "Leave your details: be among the first to test the private beta and receive the founding-member rate."}
            </p>
            {state === "done" ? (
              <div className="mt-6 rounded-2xl border border-[#3ecf8e]/30 bg-[#3ecf8e]/10 p-5 text-center text-sm text-[#3ecf8e]">
                {fr ? "✓ Inscription enregistrée ! Nous vous contacterons à l'ouverture de la bêta." : "✓ Registration saved! We will contact you when the beta opens."}
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-3">
                <input className="input" name="name" maxLength={80} placeholder={fr ? "Nom complet *" : "Full name *"} />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="input" name="email" type="email" maxLength={120} placeholder={fr ? "E-mail" : "Email"} />
                  <input className="input" name="phone" maxLength={20} placeholder={fr ? "WhatsApp" : "WhatsApp"} />
                </div>
                <select className="input" name="profile" defaultValue="">
                  <option value="" className="bg-ink">{fr ? "Votre profil" : "Your profile"}</option>
                  <option className="bg-ink" value="Ingénieur du son">{fr ? "Ingénieur du son / régisseur" : "Sound engineer / manager"}</option>
                  <option className="bg-ink" value="Église">{fr ? "Église / lieu de culte" : "Church / worship venue"}</option>
                  <option className="bg-ink" value="Salle / hôtel">{fr ? "Salle, hôtel, espace conférence" : "Hall, hotel, conference space"}</option>
                  <option className="bg-ink" value="Prestataire">{fr ? "Prestataire / loueur" : "Provider / rental company"}</option>
                  <option className="bg-ink" value="Autre">{fr ? "Autre" : "Other"}</option>
                </select>
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
                {state === "error" && <p className="text-sm text-live">{fr ? "Nom requis + e-mail ou WhatsApp." : "Name required + email or WhatsApp."}</p>}
                <button className="btn btn-gold w-full" disabled={state === "sending"}>
                  <Icon name="zap" className="h-4 w-4" /> {state === "sending" ? (fr ? "Envoi…" : "Sending…") : fr ? "S'inscrire à l'accès anticipé" : "Sign up for early access"}
                </button>
                <p className="text-center text-[11px] text-ivory/40">
                  {fr ? "Vos données servent uniquement à vous informer du lancement. Voir notre " : "Your data is only used to inform you about the launch. See our "}
                  <a href="/legal/confidentialite" className="underline hover:text-gold">{fr ? "politique de confidentialité" : "privacy policy"}</a>.
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
