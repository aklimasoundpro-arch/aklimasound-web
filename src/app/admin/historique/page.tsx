"use client";
import { useMemo, useState } from "react";
import { AdminShell, ACard, useRows } from "@/components/AdminShell";
import { Composed } from "@/components/charts";
import { Icon } from "@/components/icons";

type Ev = {
  id: string; createdAt: string; event: string; vid: string; page: string;
  label: string; ref: string; utm: Record<string, string>; lang: string;
};

const LABELS: Record<string, string> = {
  pageview: "Page vue", whatsapp_open: "Clic WhatsApp", lead_captured: "Lead capturé",
  quote_modal_open: "Ouverture devis", quote_sent: "Devis envoyé", booking_modal_open: "Ouverture réservation",
  deposit_declared: "Acompte déclaré", signup_popup_shown: "Popup réduction vue", signup_cta_click: "Clic inscription",
  phone_click: "Clic téléphone", email_click: "Clic e-mail", social_click: "Clic réseau social",
  simulator_domain: "Simulateur — domaine", simulator_step: "Simulateur — étape",
};
const dayKey = (iso: string) => iso.slice(0, 10);
const isToday = (iso: string) => dayKey(iso) === dayKey(new Date().toISOString());
const isWeek = (iso: string) => Date.now() - new Date(iso).getTime() < 7 * 864e5;

export default function Historique() {
  const { rows, loading } = useRows<Ev>("events");
  const [filter, setFilter] = useState("tous");
  const [limit, setLimit] = useState(60);

  const views = rows.filter((e) => e.event === "pageview");
  const uniques = (list: Ev[]) => new Set(list.map((e) => e.vid)).size;
  const kpis = [
    { i: "camera", l: "Visites aujourd'hui", v: uniques(views.filter((e) => isToday(e.createdAt))) },
    { i: "calendar", l: "Visiteurs 7 jours", v: uniques(views.filter((e) => isWeek(e.createdAt))) },
    { i: "chat", l: "Clics WhatsApp", v: rows.filter((e) => e.event === "whatsapp_open").length },
    { i: "file", l: "Devis envoyés", v: rows.filter((e) => e.event === "quote_sent").length },
    { i: "badge", l: "Leads captés", v: rows.filter((e) => e.event === "lead_captured").length },
    { i: "check", l: "Acomptes déclarés", v: rows.filter((e) => e.event === "deposit_declared").length },
  ];

  // 14 derniers jours : visites (barres) + clics d'action (courbe)
  const serie = useMemo(() => {
    const out: { m: string; visites: number; actions: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 864e5);
      const k = dayKey(d.toISOString());
      out.push({
        m: `${d.getDate()}/${d.getMonth() + 1}`,
        visites: views.filter((e) => dayKey(e.createdAt) === k).length,
        actions: rows.filter((e) => e.event !== "pageview" && dayKey(e.createdAt) === k).length,
      });
    }
    return out;
  }, [rows, views]);

  // provenance : UTM de pubs, puis référents, puis direct
  const sources = useMemo(() => {
    const m = new Map<string, number>();
    views.forEach((e) => {
      const camp = e.utm?.utm_campaign;
      const src = e.utm?.utm_source;
      let dom = "direct";
      if (e.ref) {
        try { dom = new URL(e.ref.startsWith("http") ? e.ref : `https://${e.ref}`).hostname.replace("www.", ""); } catch { dom = e.ref.slice(0, 28); }
      }
      const key = camp ? `${src || "pub"} · ${camp}` : src ? `pub · ${src}` : dom;
      m.set(key, (m.get(key) ?? 0) + 1);
    });
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [views]);

  const types = ["tous", ...new Set(rows.map((e) => e.event))];
  const shown = rows.filter((e) => filter === "tous" || e.event === filter).slice(0, limit);

  return (
    <AdminShell title="Historique & statistiques">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {kpis.map((k, i) => (
            <div key={i} className="glass rounded-2xl p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/12 text-gold"><Icon name={k.i} className="h-4 w-4" /></span>
              <p className="mt-2 font-display text-xl font-bold">{k.v}</p>
              <p className="text-[10px] uppercase tracking-widest text-ivory/50">{k.l}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <ACard title="14 derniers jours" className="lg:col-span-2">
            <Composed data={serie} barKey="visites" lineKey="actions" barLabel="Pages vues" lineLabel="Actions (clics, envois)" />
          </ACard>
          <ACard title="Provenance des visites">
            {sources.length ? (
              <ul className="space-y-2 text-sm">
                {sources.map(([s, n]) => (
                  <li key={s} className="flex items-center justify-between rounded-xl border border-ivory/10 bg-white/[0.03] px-3 py-2">
                    <span className="text-ivory/75">{s}</span><b className="text-gold">{n}</b>
                  </li>
                ))}
              </ul>
            ) : <p className="py-10 text-center text-sm text-ivory/45">Aucune visite enregistrée pour l'instant.</p>}
            <p className="mt-3 text-[11px] leading-relaxed text-ivory/40">
              Astuce pubs Facebook : utilisez des liens comme <code className="text-gold/80">…/?utm_source=facebook&amp;utm_campaign=mariage2026</code> — chaque visite sera attribuée ici.
            </p>
          </ACard>
        </div>

        <ACard title="Journal des événements"
          right={
            <select className="input !w-auto !py-1 !px-2 !text-xs" value={filter} onChange={(e) => { setFilter(e.target.value); setLimit(60); }}>
              {types.map((t) => <option key={t} className="bg-ink" value={t}>{t === "tous" ? "Tous les événements" : (LABELS[t] ?? t)}</option>)}
            </select>
          }>
          {loading ? (
            <p className="py-12 text-center text-sm text-ivory/45">Chargement…</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-ivory/10 text-left text-[10px] uppercase tracking-widest text-ivory/45">
                      <th className="py-2 pr-3">Heure</th><th className="py-2 pr-3">Événement</th><th className="py-2 pr-3">Page</th>
                      <th className="py-2 pr-3">Détail</th><th className="py-2 pr-3">Visiteur</th><th className="py-2">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((e) => (
                      <tr key={e.id} className="border-b border-ivory/5 text-ivory/75">
                        <td className="whitespace-nowrap py-2 pr-3 text-xs text-ivory/45">{new Date(e.createdAt).toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                        <td className="py-2 pr-3"><span className="chip !py-0.5 !px-2 !text-[9px]">{LABELS[e.event] ?? e.event}</span></td>
                        <td className="py-2 pr-3 text-xs">{e.page}</td>
                        <td className="max-w-[220px] truncate py-2 pr-3 text-xs text-ivory/55">{e.label || "—"}</td>
                        <td className="py-2 pr-3 font-mono text-[10px] text-ivory/40">{e.vid ? e.vid.slice(0, 10) : "—"}</td>
                        <td className="py-2 text-xs text-ivory/50">{e.utm?.utm_source ? `${e.utm.utm_source}${e.utm.utm_campaign ? ` · ${e.utm.utm_campaign}` : ""}` : e.ref ? e.ref.replace(/^https?:\/\//, "").slice(0, 28) : "direct"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!shown.length && <p className="py-12 text-center text-sm text-ivory/45">Aucun événement — navigue sur le site public, tout s'enregistre ici.</p>}
              </div>
              {rows.filter((e) => filter === "tous" || e.event === filter).length > limit && (
                <button onClick={() => setLimit((l) => l + 120)} className="btn btn-outline mx-auto mt-4 !py-2 text-xs">Afficher plus</button>
              )}
            </>
          )}
        </ACard>

        <p className="pb-2 text-center text-[11px] text-ivory/40">
          Suivi 1re partie sans cookie tiers — journal de 5 000 événements. Persistance en ligne après migration Supabase.
        </p>
      </div>
    </AdminShell>
  );
}
