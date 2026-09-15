"use client";
import { AdminShell, ACard, useRows } from "@/components/AdminShell";
import { Icon } from "@/components/icons";
import { api } from "@/lib/admin-api";

type Notif = { id: string; createdAt: string; icon: string; title: string; hot: boolean; read: boolean };

export default function Notifications() {
  const { rows, reload, loading } = useRows<Notif>("notifications");

  const allRead = async () => {
    await Promise.all(rows.filter((n) => !n.read).map((n) => api.patch("notifications", n.id, { read: true }).catch(() => {})));
    reload();
  };

  return (
    <AdminShell title="Notifications">
      <ACard title={`${rows.filter((n) => !n.read).length} non lue(s)`}
        right={<button onClick={allRead} className="btn btn-outline !py-1.5 !px-3 text-[11px]">Tout marquer lu</button>}>
        {loading ? (
          <p className="py-12 text-center text-sm text-ivory/45">Chargement…</p>
        ) : (
          <ul className="space-y-2">
            {rows.map((n) => (
              <li key={n.id} className={`flex items-start gap-3 rounded-2xl border p-3.5 text-sm ${n.hot && !n.read ? "border-gold/30 bg-gold/[0.06]" : "border-ivory/10 bg-white/[0.03]"}`}>
                <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${n.hot ? "bg-gold/15 text-gold" : "bg-white/5 text-ivory/60"}`}><Icon name={n.icon} className="h-4 w-4" /></span>
                <div className="flex-1">
                  <p className={n.read ? "text-ivory/55" : "text-ivory/90"}>{n.title}</p>
                  <p className="mt-0.5 text-[11px] text-ivory/45">{new Date(n.createdAt).toLocaleString("fr-FR")}{n.hot && !n.read ? " · action requise" : ""}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  {!n.read && <button onClick={async () => { await api.patch("notifications", n.id, { read: true }).catch(() => {}); reload(); }} className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-ivory/55 hover:text-gold">Lu</button>}
                  <button onClick={async () => { await api.del("notifications", n.id).catch(() => {}); reload(); }} className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-ivory/40 hover:text-live">Suppr.</button>
                </div>
              </li>
            ))}
            {!rows.length && <p className="py-12 text-center text-sm text-ivory/45">Aucune notification.</p>}
          </ul>
        )}
      </ACard>
    </AdminShell>
  );
}
