"use client";
import { useState } from "react";
import Link from "next/link";
import SoundWaves from "@/components/SoundWaves";
import { BlurText } from "@/components/motion";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function Connexion() {
  const { lang } = useI18n();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const fr = lang === "fr";
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <SoundWaves density={0.7} />
      <Link href="/" className="absolute left-5 top-5 text-sm text-ivory/60 hover:text-gold">← {fr ? "Retour au site" : "Back to site"}</Link>

      <div className="pop-in glass relative w-full max-w-md rounded-3xl bg-ink-2/90 p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center">
            <Image src="/img/logo-aks-white.png" alt="Aklimasound" width={1254} height={1254} className="logo-breathe h-24 w-24 object-contain" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-[0.14em]"><BlurText text="AKLIMASOUND" delay={70} /></h1>
          <p className="mt-1 text-[10px] uppercase tracking-[0.34em] text-gold/80">La passion du son</p>
        </div>

        <div className="mb-6 flex rounded-full border border-ivory/15 p-1 text-sm font-semibold">
          {(["signup", "login"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 rounded-full py-2 transition ${mode === m ? "bg-gold text-black" : "text-ivory/60"}`}>
              {m === "signup" ? (fr ? "Inscription" : "Sign up") : (fr ? "Connexion" : "Sign in")}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {mode === "signup" && (
            <input className="input" placeholder={fr ? "Nom complet" : "Full name"} maxLength={80} />
          )}
          <input className="input" type="email" placeholder={fr ? "Adresse e-mail" : "Email address"} maxLength={120} />
          <input className="input" type="password" placeholder={fr ? "Mot de passe (8 car. min.)" : "Password (8+ chars)"} maxLength={120} />
          <button type="submit" className="btn btn-gold w-full" disabled title={fr ? "Ouverture phase 2 (Supabase Auth)" : "Opening in phase 2 (Supabase Auth)"}>
            {mode === "signup" ? (fr ? "Créer mon compte & mes réductions" : "Create my account & discounts") : (fr ? "Se connecter" : "Sign in")}
          </button>
        </form>

        <div className="mt-5 rounded-2xl border border-gold/30 bg-gold/10 p-4 text-center text-xs leading-relaxed text-ivory/70">
          {fr
            ? "Espace membres & administration : ouverture en phase 2 avec Supabase Auth (cookies HttpOnly, sessions sécurisées, aucune donnée sensible exposée). Vos réductions d'inscription seront activées automatiquement."
            : "🔐 Member & admin space: opening in phase 2 with Supabase Auth (HttpOnly cookies, secure sessions, no sensitive data exposed). Your signup discounts will be activated automatically."}
        </div>
      </div>
    </main>
  );
}
