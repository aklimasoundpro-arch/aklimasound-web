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
import { store } from "@/lib/store";
import { CONTACT } from "@/lib/data";
import { PhoneInput } from "./PhoneInput";

const FEATURES = [
  { icon: "sliders", t: { fr: "Multiconsole & multimarque", en: "Multi-console & multi-brand" }, d: { fr: "Pilotez plusieurs consoles numériques de marques différentes — Yamaha, Behringer, Allen & Heath, Midas, Soundcraft, PreSonus… — depuis une seule interface unifiée.", en: "Drive several digital consoles from different brands — Yamaha, Behringer, Allen & Heath, Midas, Soundcraft, PreSonus… — from one unified interface." } },
  { icon: "mic", t: { fr: "Contrôle & commandes vocales", en: "Voice control & commands" }, d: { fr: "Pilotez le son à la voix, mains libres : « monte la voix lead », « baisse les retours », « coupe le micro 3 », « mute le groupe ». Reconnaissance vocale en français et en anglais, personnalisable selon votre vocabulaire de scène.", en: "Control sound hands-free by voice: “raise the lead vocal”, “lower the monitors”, “mute mic 3”. Voice recognition in French and English, customisable to your stage vocabulary." } },
  { icon: "zap", t: { fr: "Auto-mix intelligent", en: "Intelligent auto-mix" }, d: { fr: "Gains, égalisation et détection de larsen ajustés en temps réel par l'IA.", en: "Gains, EQ and feedback detection adjusted in real time by AI." } },
  { icon: "phone", t: { fr: "Contrôle à distance", en: "Remote control" }, d: { fr: "Réglez le son depuis tablette, téléphone ou PC — sur site ou à distance.", en: "Adjust sound from tablet, phone or PC — on site or remotely." } },
  { icon: "package", t: { fr: "Scènes dans le cloud", en: "Cloud scenes" }, d: { fr: "Sauvegardez et rappelez scènes et profils par lieu, événement ou équipe.", en: "Save and recall scenes and profiles per venue, event or team." } },
  { icon: "camera", t: { fr: "Supervision live", en: "Live supervision" }, d: { fr: "Vumètres, alertes et journal détaillé de chaque session en direct.", en: "Meters, alerts and detailed log of every session, live." } },
  { icon: "graduation", t: { fr: "Mode Apprentissage IA", en: "AI Learning Mode" }, d: { fr: "Votre IA vous aide à maîtriser votre console : tutoriels interactifs adaptés à votre modèle exact, guidage pas à pas en langage simple. Achetez une console complexe l'esprit tranquille.", en: "Your AI helps you master your console: interactive tutorials matched to your exact model, step-by-step guidance in plain language. Buy a complex console with peace of mind." } },
  { icon: "badge", t: { fr: "SaaS & mises à jour", en: "SaaS & updates" }, d: { fr: "Abonnement par poste, mises à jour continues incluses, aucun serveur à gérer.", en: "Per-seat subscription, continuous updates included, no server to manage." } },
];

const BRANDS = ["Yamaha", "Behringer", "Allen & Heath", "Midas", "Soundcraft", "PreSonus", "Mackie", "Roland"];

const VOICE_EXAMPLES = {
  fr: ["« Monte la voix lead »", "« Baisse les retours de 3 dB »", "« Coupe le micro 3 »", "« Mute le groupe batterie »", "« Rappelle la scène culte »"],
  en: ["“Raise the lead vocal”", "“Lower the monitors by 3 dB”", "“Mute mic 3”", "“Mute the drum group”", "“Recall the worship scene”"],
};

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
    if (phone && !/^\+[0-9 ().-]{7,20}$/.test(phone)) return setState("error"); // indicatif obligatoire si téléphone fourni
    setState("sending");
    const lh: Record<string, string> = { "Content-Type": "application/json" };
    try { const mt = store.get("aks_member_tok"); if (mt) lh["x-aks-member"] = mt; } catch { /* stockage indisponible */ }
    fetch("/api/public/leads", {
      method: "POST",
      headers: lh,
      credentials: "include",
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
      <QuoteModal open={open} onClose={() => setOpen(false)} preset="AKLIMASOUND LOGICS" wa={CONTACT.wa2} />

      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden pb-20 pt-36">
        <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(ellipse at 50% -20%, var(--color-gold), transparent 55%)" }} />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <span className="chip mx-auto"><Icon name="zap" className="h-3.5 w-3.5" /> {fr ? "En développement — accès anticipé ouvert" : "In development — early access open"}</span>
            <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.5em] text-gold">Aklimasound Logics</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
              {fr ? "Toutes vos consoles numériques. Toutes marques. Une seule interface, pilotée par IA et à la voix." : "All your digital consoles. All brands. One interface, driven by AI and voice."}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ivory/65">
              {fr
                ? "AKLIMASOUND LOGICS est un logiciel SaaS qui unifie le contrôle de plusieurs consoles numériques de marques différentes (Yamaha, Behringer, Allen & Heath, Midas, Soundcraft…) depuis une seule interface, avec assistance IA en temps réel, commandes vocales mains libres et mode Apprentissage intégré : auto-mix, anti-larsen, scènes cloud et supervision à distance. Conçu sur le terrain, par des ingénieurs du son."
                : "AKLIMASOUND LOGICS is a SaaS software that unifies the control of multiple digital consoles from different brands (Yamaha, Behringer, Allen & Heath, Midas, Soundcraft…) from a single interface, with real-time AI assistance, hands-free voice commands and a built-in Learning Mode: auto-mix, feedback control, cloud scenes and remote supervision. Built in the field, by sound engineers."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#acces" className="btn btn-gold" data-track="logics_cta" data-label="accès anticipé"><Icon name="badge" className="h-4 w-4" /> {fr ? "Rejoindre l'accès anticipé" : "Join early access"}</a>
              <button onClick={() => send(fr ? "Bonjour Aklimasound, je souhaite des informations sur le logiciel AKLIMASOUND LOGICS (contrôle IA multiconsole multimarque + commandes vocales)." : "Hello Aklimasound, I would like information about the AKLIMASOUND LOGICS software (multi-brand AI multi-console control + voice commands).", CONTACT.wa2)} className="btn btn-wa" data-track="logics_cta" data-label="whatsapp">
                <Icon name="chat" className="h-4 w-4" /> {fr ? "Parler du produit" : "Talk about the product"}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Multi-marques (accent produit) ---- */}
      <section className="mx-auto max-w-6xl px-6 pt-16">
        <Reveal>
          <div className="glass overflow-hidden rounded-3xl border-gold/30 p-8 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_1fr]">
              <div>
                <span className="chip"><Icon name="cable" className="h-3.5 w-3.5" /> {fr ? "Compatibilité multi-marques" : "Multi-brand compatibility"}</span>
                <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                  {fr ? "Une seule interface pour toutes vos consoles — quelles que soient les marques" : "One interface for all your consoles — whatever the brands"}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ivory/65">
                  {fr
                    ? "Salle équipée en Yamaha, église en Behringer, prestataire en Allen & Heath ? LOGICS parle le langage de chaque console et les réunit dans un contrôle unique et cohérent. Mixez plusieurs événements, plusieurs salles, plusieurs marques — simultanément, sans changer d'application ni de protocole."
                    : "Venue on Yamaha, church on Behringer, rental company on Allen & Heath? LOGICS speaks each console's language and unites them under one consistent control. Mix several events, several rooms, several brands — simultaneously, without switching apps or protocols."}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-ivory/70">
                  {(fr
                    ? ["Détection automatique des consoles sur le réseau", "Mappage unifié : vos repères restent les mêmes d'une marque à l'autre", "Ajout de nouvelles marques par mises à jour SaaS continues"]
                    : ["Automatic console discovery on the network", "Unified mapping: your references stay the same across brands", "New brands added through continuous SaaS updates"]
                  ).map((x, i) => (
                    <li key={i} className="flex items-start gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {x}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {BRANDS.map((b, i) => (
                  <div key={b} className="flex items-center justify-center rounded-2xl border border-ivory/12 bg-white/[0.04] px-3 py-4 text-center font-display text-sm font-bold tracking-wide text-ivory/80" style={{ animationDelay: `${i * 0.05}s` }}>
                    {b}
                  </div>
                ))}
                <p className="col-span-2 pt-1 text-center text-[11px] text-ivory/40">
                  {fr ? "Marques citées à titre indicatif — liste de compatibilité confirmée à la sortie de la bêta." : "Brands mentioned for guidance — compatibility list confirmed at beta release."}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---- Commandes vocales (accent produit) ---- */}
      <section className="mx-auto max-w-6xl px-6 pt-8">
        <Reveal>
          <div className="glass overflow-hidden rounded-3xl border-copper/30 p-8 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
              <div className="order-2 lg:order-1">
                <div className="space-y-2.5">
                  {VOICE_EXAMPLES[lang].map((v, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-2xl border border-ivory/10 bg-ink/60 px-4 py-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-copper/15 text-copper"><Icon name="mic" className="h-4 w-4" /></span>
                      <p className="font-display text-sm font-semibold text-ivory/85">{v}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <span className="chip !border-copper/40 !text-copper"><Icon name="mic" className="h-3.5 w-3.5" /> {fr ? "Contrôle vocal" : "Voice control"}</span>
                <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                  {fr ? "Parlez, LOGICS exécute — les mains libres pendant le show" : "Speak, LOGICS executes — hands-free during the show"}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ivory/65">
                  {fr
                    ? "Pendant un culte, un concert ou un discours, chaque seconde compte. Les commandes vocales de LOGICS exécutent vos ordres instantanément : niveaux, mutes, scènes, groupes — sans quitter le plateau des yeux ni lâcher la tablette. L'IA apprend vos habitudes et votre vocabulaire pour réagir toujours plus vite et plus juste."
                    : "During a service, concert or speech, every second counts. LOGICS voice commands execute your orders instantly: levels, mutes, scenes, groups — without taking your eyes off the stage or putting down the tablet. The AI learns your habits and vocabulary to react faster and more accurately."}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-ivory/70">
                  {(fr
                    ? ["Français & anglais, vocabulaire de scène personnalisable", "Confirmation visuelle instantanée de chaque commande exécutée", "Mode silencieux : contrôle gestuel/tactile si l'environnement est bruyant"]
                    : ["French & English, customisable stage vocabulary", "Instant visual confirmation of every executed command", "Silent mode: gesture/touch control in noisy environments"]
                  ).map((x, i) => (
                    <li key={i} className="flex items-start gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-copper" /> {x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---- Mode Apprentissage IA (accent produit) ---- */}
      <section className="mx-auto max-w-6xl px-6 pt-8">
        <Reveal>
          <div className="glass overflow-hidden rounded-3xl border-gold/30 p-8 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
              <div>
                <span className="chip"><Icon name="graduation" className="h-3.5 w-3.5" /> {fr ? "Mode Apprentissage" : "Learning Mode"}</span>
                <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                  {fr ? "Achetez une console complexe. Votre IA vous apprend à la maîtriser." : "Buy a complex console. Your AI teaches you to master it."}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ivory/65">
                  {fr
                    ? "Une console numérique avancée ne doit plus faire peur. Le mode Apprentissage de LOGICS connaît votre modèle exact et vous guide selon votre niveau : chaque fonction complexe devient une suite d'étapes simples, expliquées en langage clair, au moment où vous en avez besoin."
                    : "An advanced digital console should no longer be intimidating. LOGICS Learning Mode knows your exact model and guides you at your level: every complex function becomes a series of simple steps, explained in plain language, right when you need it."}
                </p>
                <ul className="mt-5 space-y-2 text-sm text-ivory/70">
                  {(fr
                    ? ["Tutoriels interactifs adaptés à votre modèle de console", "Guidage pas à pas en temps réel pendant vos réglages", "Parcours progressif : débutant → confirmé → expert", "Langage simple, sans jargon — en français et en anglais"]
                    : ["Interactive tutorials matched to your console model", "Step-by-step guidance in real time while you adjust", "Progressive path: beginner → confident → expert", "Plain language, no jargon — in French and English"]
                  ).map((x, i) => (
                    <li key={i} className="flex items-start gap-2"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {x}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                {(fr
                  ? [
                      { q: "« Comment couper les larsens sur cette console ? »", a: "L'IA montre chaque étape sur VOTRE modèle, en direct." },
                      { q: "« Enregistre-moi les niveaux pour le culte de dimanche »", a: "Scène sauvegardée + explication de chaque réglage choisi." },
                      { q: "« Apprends-moi la compression vocale »", a: "Mini-leçon pratique appliquée à votre propre mix." },
                    ]
                  : [
                      { q: "“How do I stop feedback on this console?”", a: "The AI shows every step on YOUR model, live." },
                      { q: "“Save the levels for Sunday service”", a: "Scene saved + explanation of every chosen setting." },
                      { q: "“Teach me vocal compression”", a: "Hands-on mini-lesson applied to your own mix." },
                    ]
                ).map((x, i) => (
                  <div key={i} className="rounded-2xl border border-ivory/10 bg-ink/60 p-4">
                    <p className="font-display text-sm font-semibold text-gold/90">{x.q}</p>
                    <p className="mt-1.5 text-xs text-ivory/60">→ {x.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
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
                  <PhoneInput world required={false} />
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
            <p className="mt-5 text-center text-xs text-ivory/50">
              {fr ? "Question rapide ? " : "Quick question? "}
              <button onClick={() => send(fr ? "Bonjour Aklimasound, j'ai une question sur le logiciel AKLIMASOUND LOGICS." : "Hello Aklimasound, I have a question about the AKLIMASOUND LOGICS software.", CONTACT.wa2)} className="font-semibold text-wa underline-offset-2 hover:underline">{fr ? "Écrivez-nous sur WhatsApp" : "Message us on WhatsApp"}</button>
            </p>
          </div>
        </Reveal>
      </section>

      <Footer />
    </>
  );
}
