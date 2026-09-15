"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icons";
import { api } from "@/lib/admin-api";

export default function AdminLogin() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await api.login(String(new FormData(e.currentTarget).get("password") ?? ""));
      router.replace("/admin");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Connexion refusée.");
      setBusy(false);
    }
  };

  return (
    <main className="bg-motif flex min-h-screen items-center justify-center p-4">
      <div className="pop-in glass w-full max-w-sm rounded-3xl p-8">
        <div className="mb-6 text-center">
          <Image src="/img/logo-aks-white.png" alt="Aklimasound" width={1254} height={1254} className="logo-breathe mx-auto h-20 w-20 object-contain" />
          <h1 className="mt-4 font-display text-xl font-bold tracking-[0.14em]">ESPACE DE GESTION</h1>
          <p className="mt-1 text-xs text-ivory/50">Accès réservé à l'équipe Aklimasound</p>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <input className="input" type="password" name="password" placeholder="Mot de passe" autoFocus autoComplete="current-password" />
          {err && <p className="text-sm text-live">{err}</p>}
          <button className="btn btn-gold w-full" disabled={busy}>
            <Icon name="check" className="h-4 w-4" /> {busy ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="mt-5 text-center text-[11px] text-ivory/40">
          Session chiffrée (cookie signé, 7 jours). <Link href="/" className="underline hover:text-gold">Retour au site</Link>
        </p>
      </div>
    </main>
  );
}
