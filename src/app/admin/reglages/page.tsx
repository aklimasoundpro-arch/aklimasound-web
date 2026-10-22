"use client";
import { useEffect, useState } from "react";
import { AdminShell, ACard } from "@/components/AdminShell";
import { Icon } from "@/components/icons";
import { api } from "@/lib/admin-api";

export default function Reglages() {
  const [discount, setDiscount] = useState<number>(10);
  const [msg, setMsg] = useState("");
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    api.list<{ memberDiscount: number }>("settings")
      .then((s) => setDiscount(s.memberDiscount))
      .catch(() => {});
  }, []);

  const saveDiscount = async () => {
    setMsg("");
    try {
      await api.patch("settings", "-", { memberDiscount: discount });
      setMsg("Réduction enregistrée — le prix membre s'applique automatiquement aux comptes connectés.");
    } catch {
      setMsg("Erreur lors de l'enregistrement.");
    }
  };

  const savePw = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.next !== pw.confirm) return setPwMsg({ ok: false, text: "La confirmation ne correspond pas." });
    try {
      await api.changePassword(pw.current, pw.next);
      setPwMsg({ ok: true, text: "Mot de passe modifié. Session renouvelée." });
      setPw({ current: "", next: "", confirm: "" });
    } catch (ex) {
      setPwMsg({ ok: false, text: ex instanceof Error ? ex.message : "Refusé." });
    }
  };

  return (
    <AdminShell title="Réductions & réglages">
      <div className="grid gap-5 lg:grid-cols-2">
        <ACard title="Réduction membre (prix automatique)">
          <p className="mb-4 text-sm text-ivory/60">
            Pourcentage appliqué automatiquement aux visiteurs connectés (prix barré sur les offres). 0 = désactivée.
          </p>
          <div className="flex items-center gap-4">
            <input type="range" min={0} max={30} step={1} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="flex-1 accent-[#f4f4f5]" />
            <span className="font-display w-16 text-right text-2xl font-bold text-gold">{discount} %</span>
          </div>
          <button onClick={saveDiscount} className="btn btn-gold mt-4 !py-2 text-xs"><Icon name="check" className="h-3.5 w-3.5" /> Enregistrer</button>
          {msg && <p className="mt-3 text-xs text-gold">{msg}</p>}
        </ACard>

        <ACard title="Mot de passe admin">
          <form onSubmit={savePw} className="space-y-3">
            <input className="input" type="password" placeholder="Mot de passe actuel" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" />
            <input className="input" type="password" placeholder="Nouveau (10 car. min., 1 majuscule, 1 chiffre)" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" />
            <input className="input" type="password" placeholder="Confirmer le nouveau" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" />
            {pwMsg && <p className={`text-xs ${pwMsg.ok ? "text-[#3ecf8e]" : "text-live"}`}>{pwMsg.text}</p>}
            <button className="btn btn-gold !py-2 text-xs">Changer le mot de passe</button>
          </form>
          <p className="mt-4 text-[11px] leading-relaxed text-ivory/40">
            Sécurité : mot de passe haché (scrypt + sel), cookie de session signé HMAC-SHA256, HttpOnly, 7 jours, limite de 5 tentatives / 2 min. Une seule adresse admin, utilisable sur plusieurs appareils.
          </p>
        </ACard>

        <ACard title="Installer l'app de gestion (PWA)" className="lg:col-span-2">
          <div className="grid gap-4 text-sm text-ivory/65 sm:grid-cols-2">
            <p><b className="text-ivory">Mobile</b> — ouvrez /admin dans le navigateur, puis « Ajouter à l'écran d'accueil ». L'app s'ouvre en plein écran avec le logo animé.</p>
            <p><b className="text-ivory">PC</b> — cliquez sur l'icône « Installer » dans la barre d'adresse (Chrome/Edge). Même compte sur tous vos appareils.</p>
          </div>
        </ACard>

        <ACard title="Prochaine phase (1b)" className="lg:col-span-2">
          <ul className="grid gap-2 text-sm text-ivory/60 sm:grid-cols-2">
            <li>• Base Supabase (données en ligne, sauvegardes, multi-appareils temps réel)</li>
            <li>• E-mails Brevo : devis reçu, acompte à valider, rappel J-1, résumé 18 h</li>
            <li>• Coûts réels par prestation (profit/perte exact), factures PDF</li>
            <li>• Comptes membres clients (espace client, prix membre automatique côté site)</li>
          </ul>
        </ACard>
      </div>
    </AdminShell>
  );
}
