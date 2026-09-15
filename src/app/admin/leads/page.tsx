"use client";
import { AdminShell, ACard, useRows } from "@/components/AdminShell";
import { api } from "@/lib/admin-api";

type Lead = { id: string; createdAt: string; name: string; phone: string; email: string; source: string };

export default function Leads() {
  const { rows, reload, loading } = useRows<Lead>("leads");
  return (
    <AdminShell title="Leads">
      <ACard title={`${rows.length} contact(s) capturé(s)`}>
        {loading ? (
          <p className="py-12 text-center text-sm text-ivory/45">Chargement…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ivory/10 text-left text-[11px] uppercase tracking-widest text-ivory/45">
                  <th className="py-2 pr-4">Nom</th><th className="py-2 pr-4">WhatsApp</th><th className="py-2 pr-4">E-mail</th><th className="py-2 pr-4">Source</th><th className="py-2 pr-4">Date</th><th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {rows.map((l) => (
                  <tr key={l.id} className="border-b border-ivory/5 text-ivory/75">
                    <td className="py-2.5 pr-4 font-medium">{l.name}</td>
                    <td className="py-2.5 pr-4"><a className="hover:text-gold" href={`tel:${l.phone.replace(/\s/g, "")}`}>{l.phone}</a></td>
                    <td className="py-2.5 pr-4">{l.email ? <a className="hover:text-gold" href={`mailto:${l.email}`}>{l.email}</a> : "—"}</td>
                    <td className="py-2.5 pr-4 text-xs text-ivory/50">{l.source || "—"}</td>
                    <td className="py-2.5 pr-4 text-xs text-ivory/45">{new Date(l.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td className="py-2.5 text-right">
                      <button onClick={async () => { await api.del("leads", l.id).catch(() => {}); reload(); }} className="text-[10px] text-ivory/40 hover:text-live">Suppr.</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && <p className="py-12 text-center text-sm text-ivory/45">Aucun lead — la porte WhatsApp et le formulaire devis alimentent cette liste.</p>}
          </div>
        )}
      </ACard>
    </AdminShell>
  );
}
