"use client";
import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import SoundWaves from "@/components/SoundWaves";
import { BlurText } from "@/components/motion";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";
import { useMember } from "@/lib/member";
import { track } from "@/lib/track";

type Mode = "signup" | "login" | "forgot" | "reset";

const MSG: Record<string, { fr: string; en: string }> = {
  name: { fr: "Prénom et nom : 2 caractères minimum chacun.", en: "First and last name: at least 2 characters each." },
  email: { fr: "Adresse e-mail invalide.", en: "Invalid email address." },
  password: { fr: "Mot de passe : 8 caractères min., avec au moins 1 lettre et 1 chiffre.", en: "Password: 8+ characters, with at least 1 letter and 1 number." },
  credentials: { fr: "Renseignez votre e-mail et votre mot de passe.", en: "Enter your email and password." },
  email_exists: { fr: "Un compte existe déjà avec cet e-mail. Connectez-vous ou réinitialisez votre mot de passe.", en: "An account already exists with this email. Sign in or reset your password." },
  bad_credentials: { fr: "E-mail ou mot de passe incorrect.", en: "Incorrect email or password." },
  not_confirmed: { fr: "Votre e-mail n'est pas encore confirmé. Vérifiez votre boîte de réception (et vos indésirables).", en: "Your email is not confirmed yet. Check your inbox (and spam folder)." },
  rate_limited: { fr: "Trop de tentatives. Réessayez dans quelques minutes.", en: "Too many attempts. Try again in a few minutes." },
  unavailable: { fr: "Les comptes membres seront activés dès le branchement de Supabase (configuration en cours).", en: "Member accounts will be enabled once Supabase is connected (setup in progress)." },
  server_error: { fr: "Service momentanément indisponible. Réessayez dans un instant.", en: "Service temporarily unavailable. Please try again shortly." },
  network: { fr: "Connexion impossible. Vérifiez votre réseau.", en: "Cannot connect. Check your network." },
  bad_token: { fr: "Lien de réinitialisation invalide ou expiré. Redemandez un lien ci-dessous.", en: "Invalid or expired reset link. Request a new one below." },
  token: { fr: "Jeton de réinitialisation manquant.", en: "Missing reset token." },
  bot: { fr: "Soumission rejetée.", en: "Submission rejected." },
  invalid: { fr: "Requête invalide.", en: "Invalid request." },
  unknown_action: { fr: "Action inconnue.", en: "Unknown action." },
  no_session: { fr: "Session expirée. Reconnectez-vous.", en: "Session expired. Please sign in again." },
  payload: { fr: "Requête trop volumineuse.", en: "Payload too large." },
};

export default function ConnexionView() {
  const { lang } = useI18n();
  const fr = lang === "fr";
  const router = useRouter();
  const params = useSearchParams();
  const { call, setTokenLocal, refresh, connected } = useMember();

  const [mode, setMode] = useState<Mode>("signup");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [sentEmail, setSentEmail] = useState("");
  const [tokenHash, setTokenHash] = useState("");
  const [needConfirm, setNeedConfirm] = useState(false);

  const msg = (code?: string) => (code && MSG[code] ? (fr ? MSG[code].fr : MSG[code].en) : fr ? "Une erreur est survenue." : "Something went wrong.");

  // Lien de réinitialisation reçu par e-mail : ?token_hash=…&type=recovery (PKCE) ou #token_hash=…
  useEffect(() => {
    try {
      let th = params.get("token_hash");
      const ty = params.get("type");
      if (!th && typeof window !== "undefined" && window.location.hash) {
        const hp = new URLSearchParams(window.location.hash.replace(/^#/, ""));
        th = hp.get("token_hash");
      }
      if (th) {
        setTokenHash(th);
        setMode(ty === "recovery" || !ty ? "reset" : "login");
      }
    } catch { /* URL illisible */ }
  }, [params]);

  useEffect(() => {
    if (connected && mode !== "reset") {
      setOk(fr ? "Vous êtes déjà connecté(e)." : "You are already signed in.");
    }
  }, [connected, mode, fr]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setErr(""); setOk("");
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("website") || "")) return; // honeypot anti-bot
    setBusy(true);
    track(`${mode}_submit`);

    if (mode === "signup") {
      const r = await call({
        action: "signup",
        firstName: String(fd.get("firstName") || ""),
        lastName: String(fd.get("lastName") || ""),
        email: String(fd.get("email") || ""),
        password: String(fd.get("password") || ""),
        newsletter: fd.get("newsletter") === "on",
        website: String(fd.get("website") || ""),
      });
      if (r.ok) {
        setSentEmail(String(fd.get("email") || ""));
        setMode("login");
        setOk(fr
          ? "Compte créé ! Un e-mail de confirmation vient de vous être envoyé (vérifiez aussi vos indésirables). Cliquez sur le lien, puis connectez-vous ici."
          : "Account created! A confirmation email has just been sent (also check your spam folder). Click the link, then sign in here.");
        track("signup_success");
      } else setErr(msg(r.code));
    }

    if (mode === "login") {
      const email = String(fd.get("email") || "");
      const r = await call({ action: "login", email, password: String(fd.get("password") || "") });
      if (r.ok && r.token) {
        setTokenLocal(r.token);
        await refresh();
        track("login_success");
        router.push("/compte");
      } else {
        setErr(msg(r.code));
        if (r.code === "not_confirmed") { setNeedConfirm(true); setSentEmail(email); }
      }
    }

    if (mode === "forgot") {
      const r = await call({ action: "forgot", email: String(fd.get("email") || "") });
      if (r.ok) {
        setOk(fr
          ? "Si un compte existe avec cet e-mail, un lien de réinitialisation vient d'être envoyé (vérifiez vos indésirables)."
          : "If an account exists with this email, a reset link has just been sent (check your spam folder).");
        track("forgot_success");
      } else setErr(msg(r.code));
    }

    if (mode === "reset") {
      const r = await call({ action: "reset", tokenHash, password: String(fd.get("password") || "") });
      if (r.ok) {
        setMode("login");
        setTokenHash("");
        setOk(fr ? "Mot de passe mis à jour. Connectez-vous avec votre nouveau mot de passe." : "Password updated. Sign in with your new password.");
        track("reset_success");
      } else setErr(msg(r.code));
    }

    setBusy(false);
  }

  async function resend() {
    setBusy(true);
    const r = await call({ action: "resend", email: sentEmail });
    setBusy(false);
    if (r.ok) setOk(fr ? "E-mail de confirmation renvoyé." : "Confirmation email resent.");
    else setErr(msg(r.code));
  }

  const input = "input w-full";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <SoundWaves density={0.7} />
      <Link href="/" className="absolute left-5 top-5 text-sm text-ivory/60 hover:text-gold">← {fr ? "Retour au site" : "Back to site"}</Link>

      <div className="pop-in glass relative w-full max-w-md rounded-3xl bg-ink-2/90 p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center">
            <Image src="/img/logo-aks-white.png" alt="Aklimasound" width={1254} height={1254} className="logo-breathe h-24 w-24 object-contain" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-[0.14em]"><BlurText text="AKLIMASOUND" delay={70} /></h1>
          <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-gold/80">
            {mode === "reset" ? (fr ? "Nouveau mot de passe" : "New password") : mode === "forgot" ? (fr ? "Mot de passe oublié" : "Forgot password") : fr ? "Espace membres" : "Member area"}
          </p>
        </div>

        {(mode === "signup" || mode === "login") && (
          <div className="mb-6 flex rounded-full border border-ivory/15 p-1 text-sm font-semibold">
            {(["signup", "login"] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setErr(""); setOk(""); }} className={`flex-1 rounded-full py-2 transition ${mode === m ? "bg-gold text-black" : "text-ivory/60"}`}>
                {m === "signup" ? (fr ? "Inscription" : "Sign up") : (fr ? "Connexion" : "Sign in")}
              </button>
            ))}
          </div>
        )}

        <form className="space-y-4" onSubmit={submit}>
          {mode === "signup" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <input className={input} name="firstName" placeholder={fr ? "Prénom *" : "First name *"} maxLength={40} required />
              <input className={input} name="lastName" placeholder={fr ? "Nom *" : "Last name *"} maxLength={40} required />
            </div>
          )}

          {(mode === "signup" || mode === "login" || mode === "forgot") && (
            <input className={input} name="email" type="email" placeholder={fr ? "Adresse e-mail *" : "Email address *"} maxLength={120} required autoComplete="email" />
          )}

          {(mode === "signup" || mode === "login" || mode === "reset") && (
            <input className={input} name="password" type="password" placeholder={fr ? "Mot de passe (8 car. min., 1 lettre, 1 chiffre) *" : "Password (8+ chars, 1 letter, 1 number) *"} maxLength={128} minLength={8} required autoComplete={mode === "login" ? "current-password" : "new-password"} />
          )}

          {mode === "signup" && (
            <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-ivory/65">
              <input type="checkbox" name="newsletter" className="mt-0.5 h-4 w-4 accent-[#f4f4f5]" />
              <span>
                {fr
                  ? "Je souhaite recevoir les actualités et offres Aklimasound par e-mail (désinscription en un clic à tout moment)."
                  : "I'd like to receive Aklimasound news and offers by email (one-click unsubscribe at any time)."}
              </span>
            </label>
          )}

          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />

          {err && <p className="text-sm text-live">{err}</p>}
          {ok && <p className="rounded-xl border border-wa/30 bg-wa/10 p-3 text-sm leading-relaxed text-ivory/85">{ok}</p>}

          {needConfirm && mode === "login" && (
            <button type="button" onClick={resend} disabled={busy} className="w-full text-center text-xs text-gold underline hover:text-ivory">
              {fr ? "Renvoyer l'e-mail de confirmation" : "Resend confirmation email"}
            </button>
          )}

          <button type="submit" className="btn btn-gold w-full" disabled={busy}>
            {busy
              ? (fr ? "Un instant…" : "One moment…")
              : mode === "signup"
                ? (fr ? "Créer mon compte & mes réductions" : "Create my account & discounts")
                : mode === "login"
                  ? (fr ? "Se connecter" : "Sign in")
                  : mode === "forgot"
                    ? (fr ? "Envoyer le lien de réinitialisation" : "Send reset link")
                    : (fr ? "Enregistrer le nouveau mot de passe" : "Save new password")}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-xs">
          {mode === "login" ? (
            <button onClick={() => { setMode("forgot"); setErr(""); setOk(""); setNeedConfirm(false); }} className="text-ivory/55 underline hover:text-gold">
              {fr ? "Mot de passe oublié ?" : "Forgot password?"}
            </button>
          ) : mode === "forgot" || mode === "reset" ? (
            <button onClick={() => { setMode("login"); setErr(""); setOk(""); }} className="text-ivory/55 underline hover:text-gold">
              ← {fr ? "Retour à la connexion" : "Back to sign in"}
            </button>
          ) : (
            <span />
          )}
          {connected && (
            <Link href="/compte" className="text-gold underline">{fr ? "Aller à mon compte" : "Go to my account"}</Link>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-center text-xs leading-relaxed text-ivory/70">
          {fr
            ? "Compte gratuit : prix membre réduits automatiquement, suivi de vos devis et réservations en ligne."
            : "Free account: automatic member discounts, tracking of your quotes and bookings, online deposit proof upload. No banking data requested."}
        </div>
      </div>
    </main>
  );
}
