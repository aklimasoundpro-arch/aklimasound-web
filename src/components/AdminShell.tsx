"use client";
import { useEffect, useState, ReactNode, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { Icon } from "./icons";
import { api, getToken, hasToken, setToken } from "@/lib/admin-api";

const NAV = [
  { href: "/admin", i: "sliders", l: "Cockpit" },
  { href: "/admin/reservations", i: "calendar", l: "Réservations" },
  { href: "/admin/devis", i: "file", l: "Devis" },
  { href: "/admin/leads", i: "badge", l: "Leads" },
  { href: "/admin/produits", i: "package", l: "Produits" },
  { href: "/admin/reglages", i: "gift", l: "Réductions" },
  { href: "/admin/notifications", i: "zap", l: "Notifications" },
];

/** Coquille admin : garde de session + navigation latérale. */
export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [ok, setOk] = useState<boolean | null>(null);
  const [unread, setUnread] = useState(0);

  // Jeton présent localement → affichage immédiat (la vérification serveur suit).
  useEffect(() => { if (hasToken()) setOk(true); }, []);

  useEffect(() => {
    api.session()
      .then((r: { ok: boolean }) => {
        if (r.ok) {
          setOk(true);
          if (getToken()) setToken(getToken()); // ré-ancre le jeton dans le hash (survit aux rechargements de l'iframe)
        } else {
          setToken(null);
          router.replace("/admin/connexion");
        }
      })
      .catch(() => {
        // Réseau/preview capricieux : on ne débranche que sans jeton local.
        if (!hasToken()) router.replace("/admin/connexion");
      });
  }, [router]);

  useEffect(() => {
    if (!ok) return;
    api.list<Record<string, unknown>[]>("notifications")
      .then((n) => setUnread(n.filter((x) => !x.read).length))
      .catch(() => {});
  }, [ok, path]);

  const logout = useCallback(async () => {
    await api.logout().catch(() => {});
    router.replace("/admin/connexion");
  }, [router]);

  if (ok === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <Image src="/img/logo-aks-white.png" alt="" width={1254} height={1254} className="logo-breathe h-24 w-24 object-contain" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-ink">
      {/* Sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-ivory/10 bg-ink-2/60 p-4 lg:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-3 px-2 pt-2">
          <Image src="/img/logo-aks-white.png" alt="" width={1254} height={1254} className="h-10 w-10 object-contain" />
          <div>
            <p className="font-display text-sm font-bold tracking-[0.16em]">AKLIMASOUND</p>
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold/70">Gestion</p>
          </div>
        </Link>
        <nav className="flex-1 space-y-1">
          {NAV.map((n) => {
            const active = path === n.href;
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-gold/12 font-semibold text-gold" : "text-ivory/65 hover:bg-white/5 hover:text-ivory"}`}>
                <Icon name={n.i} className="h-4 w-4" /> {n.l}
                {n.href === "/admin/notifications" && unread > 0 && (
                  <span className="ml-auto rounded-full bg-live px-1.5 py-0.5 text-[9px] font-bold text-white">{unread}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="mt-4 rounded-xl border border-ivory/10 px-3 py-2 text-center text-xs text-ivory/55 hover:border-gold/50 hover:text-gold">← Voir le site</Link>
        <button onClick={logout} className="mt-2 rounded-xl border border-ivory/10 px-3 py-2 text-xs text-ivory/55 hover:border-live/50 hover:text-live">Se déconnecter</button>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Barre mobile */}
        <header className="sticky top-0 z-40 border-b border-ivory/10 bg-ink/90 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between px-4 py-2.5">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/img/logo-aks-white.png" alt="" width={1254} height={1254} className="h-8 w-8 object-contain" />
              <span className="font-display text-xs font-bold tracking-[0.16em]">AKS ADMIN</span>
            </Link>
            <button onClick={logout} className="text-[11px] text-ivory/50">Déconnexion</button>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}
                className={`shrink-0 rounded-full border px-3 py-1 text-[11px] ${path === n.href ? "border-gold/60 bg-gold/12 text-gold" : "border-ivory/12 text-ivory/60"}`}>
                {n.l}{n.href === "/admin/notifications" && unread > 0 ? ` (${unread})` : ""}
              </Link>
            ))}
          </nav>
        </header>

        <main className="bg-motif min-h-[60vh] px-5 py-7 lg:px-8">
          <h1 className="mb-6 font-display text-2xl font-bold">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}

/** Carte verre réutilisée par les écrans admin. */
export function ACard({ title, right, children, className = "" }: { title?: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-3xl p-5 ${className}`}>
      {(title || right) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold/80">{title}</p>}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

/** Hook de liste : chargement + rechargement après mutation. */
export function useRows<T extends { id: string }>(col: string, ready = true) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(() => {
    setLoading(true);
    api.list<T[]>(col).then((r) => { setRows(r); setLoading(false); }).catch(() => setLoading(false));
  }, [col]);
  useEffect(() => { if (ready) reload(); }, [ready, reload]);
  return { rows, setRows, loading, reload };
}
