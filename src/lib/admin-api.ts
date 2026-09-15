/** Petits wrappers fetch pour l'admin et les formulaires publics (client). */
import { store } from "./store";

/* Jeton de session admin.
   Navigateur réel : cookie HttpOnly signé (posé par le serveur).
   Preview intégrée (cookies bloqués, en-têtes parfois retirés, rechargements) :
   le jeton est gardé en mémoire + hash d'URL + localStorage et renvoyé
   sur 3 canaux (Authorization Bearer, x-aks-token, ?tok=). */
function initToken(): string | null {
  if (typeof window === "undefined") return null;
  const h = window.location.hash.match(/[#&]aks=([^&]+)/);
  if (h) {
    const t = decodeURIComponent(h[1]);
    store.set("aks_admin_tok", t);
    return t;
  }
  return store.get("aks_admin_tok") || null;
}
let token: string | null = initToken();

export const getToken = () => token;
export const hasToken = () => !!token;

export function setToken(t: string | null) {
  token = t;
  try {
    if (t) store.set("aks_admin_tok", t);
    else store.set("aks_admin_tok", "");
  } catch { /* stockage indisponible : mémoire seule */ }
  if (typeof window !== "undefined") {
    try {
      const url = new URL(window.location.href);
      url.hash = t ? `aks=${t}` : "";
      window.history.replaceState(null, "", url.toString());
    } catch { /* sans effet : le jeton reste en mémoire */ }
  }
}

async function req(url: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  let u = url;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    headers.set("x-aks-token", token);
    u += (url.includes("?") ? "&" : "?") + "tok=" + encodeURIComponent(token);
  }
  const r = await fetch(u, { ...init, headers });
  if (!r.ok) {
    const e = await r.json().catch(() => ({}));
    throw new Error((e as { error?: string }).error || `HTTP ${r.status}`);
  }
  return r.json();
}
const j = (body: unknown) => ({ headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const api = {
  session: () => req("/api/admin/auth"),
  login: async (password: string) => {
    const r = await req("/api/admin/auth", { method: "POST", ...j({ action: "login", password }) });
    if (r?.token) setToken(r.token as string);
    return r;
  },
  logout: async () => {
    const r = await req("/api/admin/auth", { method: "POST", ...j({ action: "logout" }) }).catch(() => ({}));
    setToken(null);
    return r;
  },
  changePassword: async (current: string, next: string) => {
    const r = await req("/api/admin/auth", { method: "POST", ...j({ action: "password", current, next }) });
    if (r?.token) setToken(r.token as string);
    return r;
  },

  list: <T = Record<string, unknown>[]>(col: string) => req(`/api/admin/${col}`) as Promise<T>,
  create: (col: string, row: Record<string, unknown>) => req(`/api/admin/${col}`, { method: "POST", ...j(row) }),
  patch: (col: string, id: string, patch: Record<string, unknown>) => req(`/api/admin/${col}`, { method: "PATCH", ...j({ id, ...patch }) }),
  del: (col: string, id: string) => req(`/api/admin/${col}?id=${encodeURIComponent(id)}`, { method: "DELETE" }),

  /** Soumissions publiques (site) — ne lève jamais : échec silencieux côté visiteur. */
  pub: (col: "leads" | "quotes" | "bookings", body: Record<string, unknown>) => {
    fetch(`/api/public/${col}`, { method: "POST", ...j(body) }).catch(() => {});
  },
};
