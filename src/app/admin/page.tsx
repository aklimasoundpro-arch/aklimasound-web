"use client";
import { useEffect, useState } from "react";
import { AdminShell, ACard, useRows } from "@/components/AdminShell";
import { Gauge, Funnel, Composed, Donut, Rings, Radar, ProfitLoss } from "@/components/charts";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/motion";
import { api } from "@/lib/admin-api";

type Booking = { id: string; createdAt: string; customer: string; domain: string; offer: string; date: string; total: number; depositRate: number; status: string; channel: string };
type Quote = { id: string; createdAt: string; name: string; offer: string; status: string };
type Lead = { id: string };
type Notif = { id: string; createdAt: string; icon: string; title: string; hot: boolean; read: boolean };

const MOIS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
const f = (n: number) => n.toLocaleString("fr-FR");
const thisMonth = new Date().getMonth();

function Badge({ live }: { live: boolean }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${live ? "bg-[#3ecf8e]/15 text-[#3ecf8e]" : "bg-ivory/10 text-ivory/50"}`}>
      {live ? "Live" : "Démo"}
    </span>
  );
}

export default function Admin() {
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1500);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () => clearTimeout(t);
  }, []);

  const { rows: bookings } = useRows<Booking>("bookings");
  const { rows: quotes } = useRows<Quote>("quotes");
  const { rows: leads } = useRows<Lead>("leads");
  const { rows: notifs } = useRows<Notif>("notifications");

  const paid = bookings.filter((b) => ["confirmed", "ongoing", "done"].includes(b.status));
  const caMonth = paid.filter((b) => new Date(b.date || b.createdAt).getMonth() === thisMonth).reduce((s, b) => s + (b.total || 0), 0);
  const upcoming = paid.filter((b) => new Date(b.date) >= new Date(new Date().toDateString())).length;
  const pendingQuotes = quotes.filter((q) => q.status === "nouveau").length;
  const proofPending = bookings.filter((b) => b.status === "deposit_proof").length;
  const unread = notifs.filter((n) => !n.read).length;

  // séries 12 mois (réelles)
  const ca = MOIS.map((m, i) => ({
    m,
    momo: paid.filter((b) => new Date(b.date || b.createdAt).getMonth() === i).reduce((s, b) => s + (b.total || 0), 0) / 1000,
    autres: quotes.filter((q) => new Date(q.createdAt).getMonth() === i).length * 10,
  }));
  const pnl = MOIS.map((m, i) => {
    const rev = ca[i].momo;
    return { label: m, pnl: Math.round(rev > 0 ? rev * 0.4 : Math.sin(i / 2.1) * 120) };
  });
  const funnel = [
    { label: "Leads capturés", value: leads.length },
    { label: "Demandes de devis", value: quotes.length },
    { label: "Réservations", value: bookings.length },
    { label: "Acomptes validés", value: paid.length },
  ];
  const byDomain = new Map<string, number>();
  paid.forEach((b) => byDomain.set(b.domain || "Autres", (byDomain.get(b.domain || "Autres") ?? 0) + (b.total || 0)));
  const palette = ["var(--color-gold)", "var(--color-copper)", "#8ab4a0", "#7f9bc4", "rgba(245,240,230,.35)", "#c47f9b"];
  const donut = [...byDomain.entries()].slice(0, 6).map(([label, value], i) => ({ label, value, color: palette[i % palette.length] }));
  const byChan = new Map<string, number>();
  bookings.forEach((b) => byChan.set(b.channel || "autre", (byChan.get(b.channel || "autre") ?? 0) + 1));
  const maxChan = Math.max(5, ...byChan.values());
  const rings = [...byChan.entries()].slice(0, 4).map(([label, value], i) => ({ label, value, max: maxChan, color: palette[i % palette.length] }));
  const radarMetrics = [
    { key: "religieux", label: "Religieux" }, { key: "mariages", label: "Mariages" },
    { key: "concerts", label: "Concerts" }, { key: "entreprises", label: "Entreprises" }, { key: "horeca", label: "HORECA" },
  ];
  const radarSeries = [
    { label: "Ce mois", color: "var(--color-gold)", values: { religieux: 88, mariages: 72, concerts: 60, entreprises: 45, horeca: 55 } },
    { label: "Mois dernier", color: "var(--color-copper)", values: { religieux: 70, mariages: 65, concerts: 74, entreprises: 38, horeca: 48 } },
  ];
  const gauge = Math.min(95, paid.filter((b) => ["confirmed", "ongoing"].includes(b.status)).length * 16 + 20);

  const kpis = [
    { i: "badge", l: "CA encaissé (mois)", v: `${f(caMonth)} F`, s: `${paid.length} prestations payées` },
    { i: "calendar", l: "Réservations à venir", v: String(upcoming), s: `${proofPending} acompte(s) à valider` },
    { i: "file", l: "Devis à traiter", v: String(pendingQuotes), s: `${quotes.length} au total` },
    { i: "zap", l: "Notifications", v: String(unread), s: `${leads.length} leads capturés` },
  ];

  return (
    <AdminShell title="Cockpit">
      {splash && (
        <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-ink" style={{ animation: "splashOut .5s ease 1s forwards" }}>
          <img src="/img/logo-aks-white.png" alt="" className="logo-breathe h-36 w-36 object-contain" />
          <p className="mt-4 text-xs uppercase tracking-[0.4em] text-gold/80">Espace de gestion</p>
        </div>
      )}

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((k, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="glass card-hover rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-ivory/12 bg-white/5 text-gold"><Icon name={k.i} className="h-4 w-4" /></span>
                  <span className="text-[10px] text-ivory/45">{k.s}</span>
                </div>
                <p className="mt-3 font-display text-2xl font-bold">{k.v}</p>
                <p className="text-xs uppercase tracking-widest text-ivory/50">{k.l}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <ACard title="Occupation & revenus" right={<Badge live />}><Gauge value={gauge} centerValue={`${Math.round(caMonth / 1000)} k`} label="CA du mois (F)" /></ACard>
          <ACard title="Tunnel de conversion" right={<Badge live />}><Funnel data={funnel} /></ACard>
          <ACard title="Canaux de réservation" right={<Badge live />}><Rings data={rings.length ? rings : [{ label: "—", value: 0, max: 1, color: "var(--color-gold)" }]} centerLabel="réservations" /></ACard>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <ACard title="CA par mois (milliers F) & devis" right={<Badge live />}>
            <Composed data={ca} barKey="momo" lineKey="autres" barLabel="CA encaissé" lineLabel="Devis (×10)" />
          </ACard>
          <ACard title="Profit / perte mensuel (milliers F)" right={<Badge live={false} />}>
            <p className="mb-2 text-[11px] text-ivory/45">Estimation : marge 40 % du CA — coûts réels saisissables en phase 1b.</p>
            <ProfitLoss data={pnl} />
          </ACard>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <ACard title="CA par domaine" right={<Badge live />}>
            {donut.length ? <Donut data={donut} /> : <p className="py-10 text-center text-sm text-ivory/45">Aucune prestation payée pour l'instant.</p>}
          </ACard>
          <ACard title="Activité par domaine" right={<Badge live={false} />}><Radar metrics={radarMetrics} series={radarSeries} /></ACard>
          <ACard title="Dernières notifications" right={<Badge live />}>
            <ul className="space-y-2">
              {notifs.slice(0, 5).map((n) => (
                <li key={n.id} className={`flex items-start gap-3 rounded-2xl border p-3 text-sm ${n.hot && !n.read ? "border-gold/30 bg-gold/[0.06]" : "border-ivory/10 bg-white/[0.03]"}`}>
                  <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${n.hot ? "bg-gold/15 text-gold" : "bg-white/5 text-ivory/60"}`}><Icon name={n.icon} className="h-4 w-4" /></span>
                  <div className="flex-1">
                    <p className="text-ivory/85">{n.title}</p>
                    <p className="text-[11px] text-ivory/45">{new Date(n.createdAt).toLocaleString("fr-FR")}</p>
                  </div>
                </li>
              ))}
              {!notifs.length && <li className="py-6 text-center text-sm text-ivory/45">Aucune notification.</li>}
            </ul>
          </ACard>
        </div>

        <p className="pb-2 text-center text-[11px] text-ivory/40">
          Base locale persistante — branchement Supabase + envois Brevo en phase 1b.
        </p>
      </div>
    </AdminShell>
  );
}
