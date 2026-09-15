"use client";
import { AdminShell, ACard, useRows } from "@/components/AdminShell";
import { Icon } from "@/components/icons";
import { api } from "@/lib/admin-api";
import { fcfa } from "@/lib/data";

type Quote = {
  id: string; createdAt: string; name: string; phone: string; email: string; domain: string;
  offer: string; date: string; place: string; total: number; source: string; status: string; msg: string;
};
const STATUSES = ["nouveau", "envoyé", "accepté", "refusé"];

export default function Devis() {
  const { rows, reload, loading } = useRows<Quote>("quotes");

  const toBooking = async (q: Quote) => {
    await api.create("bookings", {
      customer: q.name, phone: q.phone, domain: q.domain, offer: q.offer,
      date: q.date, place: q.place, total: q.total, depositRate: 30,
      proofRef: "", status: "deposit_proof", channel: "devis",
    }).catch(() => {});
    await api.patch("quotes", q.id, { status: "accepté" }).catch(() => {});
    reload();
  };

  return (
    <AdminShell title="Devis">
      <ACard title={`${rows.length} demande(s)`}>
        {loading ? (
          <p className="py-12 text-center text-sm text-ivory/45">Chargement…</p>
        ) : (
          <div className="space-y-3">
            {rows.map((q) => (
              <div key={q.id} className="rounded-2xl border border-ivory/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ivory/90">{q.name} <span className="text-xs font-normal text-ivory/45">· {q.phone}{q.email ? ` · ${q.email}` : ""}</span></p>
                    <p className="mt-1 text-sm text-gold/90">{q.offer}{q.domain ? ` — ${q.domain}` : ""}</p>
                    <p className="mt-0.5 text-xs text-ivory/55">
                      {q.date ? `Événement : ${q.date}` : "Date à définir"}{q.place ? ` · ${q.place}` : ""} · source : {q.source}
                    </p>
                    {q.msg && <p className="mt-1.5 text-xs italic text-ivory/50">« {q.msg} »</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-display text-lg font-bold">{q.total ? fcfa(q.total) : "—"}</p>
                    <select className="input !w-auto !py-1 !px-2 !text-xs" value={q.status}
                      onChange={async (e) => { await api.patch("quotes", q.id, { status: e.target.value }).catch(() => {}); reload(); }}>
                      {STATUSES.map((s) => <option key={s} className="bg-ink" value={s}>{s}</option>)}
                    </select>
                    <div className="flex gap-1.5">
                      <button onClick={() => toBooking(q)} className="rounded-lg bg-gold/15 px-2 py-1 text-[10px] font-semibold text-gold hover:bg-gold/25">
                        <Icon name="calendar" className="mr-1 inline h-3 w-3" />Convertir en réservation
                      </button>
                      <button onClick={async () => { await api.del("quotes", q.id).catch(() => {}); reload(); }} className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-ivory/40 hover:text-live">Suppr.</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {!rows.length && <p className="py-12 text-center text-sm text-ivory/45">Aucun devis pour l'instant — les demandes du site apparaîtront ici.</p>}
          </div>
        )}
      </ACard>
    </AdminShell>
  );
}
