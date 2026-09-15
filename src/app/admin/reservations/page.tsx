"use client";
import { useState } from "react";
import { AdminShell, ACard, useRows } from "@/components/AdminShell";
import { Icon } from "@/components/icons";
import { api } from "@/lib/admin-api";
import { fcfa } from "@/lib/data";

type Booking = {
  id: string; createdAt: string; customer: string; phone: string; domain: string; offer: string;
  date: string; place: string; total: number; depositRate: number; proofRef: string; status: string; channel: string;
};

const COLS: { key: string; label: string }[] = [
  { key: "deposit_proof", label: "Acompte à valider" },
  { key: "confirmed", label: "Confirmées" },
  { key: "ongoing", label: "En cours" },
  { key: "done", label: "Terminées" },
  { key: "cancelled", label: "Annulées" },
];

export default function Reservations() {
  const { rows, reload, loading } = useRows<Booking>("bookings");
  const [form, setForm] = useState(false);
  const [msg, setMsg] = useState("");

  const act = async (id: string, patch: Record<string, unknown>) => {
    await api.patch("bookings", id, patch).catch(() => {});
    reload();
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await api.create("bookings", {
        customer: fd.get("customer"), phone: fd.get("phone"), domain: fd.get("domain"), offer: fd.get("offer"),
        date: fd.get("date"), place: fd.get("place"), total: Number(fd.get("total") || 0),
        depositRate: Number(fd.get("depositRate") || 30), proofRef: fd.get("proofRef"),
        status: fd.get("status"), channel: "admin",
      });
      setMsg("Réservation enregistrée.");
      setForm(false);
      reload();
    } catch {
      setMsg("Erreur — vérifiez les champs.");
    }
  };

  return (
    <AdminShell title="Réservations">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button onClick={() => setForm((v) => !v)} className="btn btn-gold !py-2 text-xs"><Icon name="check" className="h-3.5 w-3.5" /> Nouvelle réservation</button>
        {msg && <span className="text-xs text-gold">{msg}</span>}
      </div>

      {form && (
        <ACard title="Ajouter une réservation" className="mb-6">
          <form onSubmit={submit} className="grid gap-3 sm:grid-cols-3">
            <input className="input" name="customer" placeholder="Client / organisation *" required />
            <input className="input" name="phone" placeholder="Téléphone *" required />
            <input className="input" name="domain" placeholder="Domaine (ex. Religieux)" />
            <input className="input" name="offer" placeholder="Offre / formule" />
            <input className="input" name="date" type="date" />
            <input className="input" name="place" placeholder="Lieu" />
            <input className="input" name="total" type="number" min={0} placeholder="Montant total (F)" />
            <select className="input" name="depositRate" defaultValue={30}>
              <option className="bg-ink" value={30}>Acompte 30 %</option>
              <option className="bg-ink" value={50}>Acompte 50 %</option>
            </select>
            <select className="input" name="status" defaultValue="confirmed">
              <option className="bg-ink" value="deposit_proof">Acompte à valider</option>
              <option className="bg-ink" value="confirmed">Confirmée</option>
              <option className="bg-ink" value="ongoing">En cours</option>
              <option className="bg-ink" value="done">Terminée</option>
            </select>
            <input className="input sm:col-span-2" name="proofRef" placeholder="Référence preuve Mobile Money (ex. MIXX-12345)" />
            <button className="btn btn-gold">Enregistrer</button>
          </form>
        </ACard>
      )}

      {loading ? (
        <p className="py-16 text-center text-sm text-ivory/45">Chargement…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {COLS.map((c) => {
            const cards = rows.filter((b) => b.status === c.key);
            return (
              <div key={c.key} className="rounded-2xl border border-ivory/10 bg-white/[0.03] p-3">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-ivory/55">{c.label} · {cards.length}</p>
                <div className="space-y-2">
                  {cards.map((b) => (
                    <div key={b.id} className="rounded-xl border border-ivory/10 bg-ink-2 p-3 text-xs">
                      <p className="font-semibold text-ivory/90">{b.customer}</p>
                      <p className="mt-0.5 text-ivory/55">{b.offer}{b.domain ? ` — ${b.domain}` : ""}</p>
                      <p className="mt-1 text-ivory/70"><Icon name="calendar" className="mr-1 inline h-3 w-3" />{b.date || "date à définir"}{b.place ? ` · ${b.place}` : ""}</p>
                      {b.total > 0 && <p className="mt-1 text-gold">{fcfa(b.total)} · acompte {b.depositRate} %</p>}
                      {b.proofRef && <p className="mt-0.5 text-ivory/45">Preuve : {b.proofRef} ({b.channel})</p>}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {b.status === "deposit_proof" && (
                          <>
                            <button onClick={() => act(b.id, { status: "confirmed" })} className="rounded-lg bg-gold/15 px-2 py-1 text-[10px] font-semibold text-gold hover:bg-gold/25">Valider l'acompte</button>
                            <button onClick={() => act(b.id, { status: "cancelled" })} className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-ivory/50 hover:text-live">Annuler</button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <>
                            <button onClick={() => act(b.id, { status: "ongoing" })} className="rounded-lg bg-gold/15 px-2 py-1 text-[10px] font-semibold text-gold hover:bg-gold/25">Démarrer</button>
                            <button onClick={() => act(b.id, { status: "cancelled" })} className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-ivory/50 hover:text-live">Annuler</button>
                          </>
                        )}
                        {b.status === "ongoing" && (
                          <button onClick={() => act(b.id, { status: "done" })} className="rounded-lg bg-[#3ecf8e]/15 px-2 py-1 text-[10px] font-semibold text-[#3ecf8e] hover:bg-[#3ecf8e]/25">Terminer</button>
                        )}
                        {["done", "cancelled"].includes(b.status) && (
                          <button onClick={async () => { await api.del("bookings", b.id).catch(() => {}); reload(); }} className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-ivory/40 hover:text-live">Supprimer</button>
                        )}
                      </div>
                    </div>
                  ))}
                  {!cards.length && <p className="py-4 text-center text-[11px] text-ivory/30">Vide</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
