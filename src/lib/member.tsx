"use client";
/**
 * Contexte membre (site public) : session, profil, réduction membre.
 * Jeton multi-canal comme pour l'admin : cookie HttpOnly posé par le serveur
 * (navigateur réel) + stockage local pour la preview intégrée (cookies bloqués).
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { store } from "./store";

const TOK_KEY = "aks_member_tok";

export type MemberProfile = {
  firstName: string;
  lastName: string;
  email: string;
  newsletter: boolean;
  confirmed: boolean;
};

export type ApiResult = {
  ok: boolean;
  code?: string;
  error?: string;
  token?: string;
  profile?: MemberProfile;
  discount?: number;
};

type MemberCtx = {
  ready: boolean;
  connected: boolean;
  profile: MemberProfile | null;
  discount: number;
  call: (payload: Record<string, unknown>) => Promise<ApiResult>;
  refresh: () => Promise<void>;
  setTokenLocal: (t: string | null) => void;
  getToken: () => string | null;
};

const Ctx = createContext<MemberCtx>({
  ready: false,
  connected: false,
  profile: null,
  discount: 0,
  call: async () => ({ ok: false, code: "no_provider" }),
  refresh: async () => {},
  setTokenLocal: () => {},
  getToken: () => null,
});

export function useMember() {
  return useContext(Ctx);
}

export function MemberProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [discount, setDiscount] = useState(0);
  const tokRef = useRef<string | null>(null);

  const call = useCallback(async (payload: Record<string, unknown>): Promise<ApiResult> => {
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const t = tokRef.current || store.get(TOK_KEY);
      if (t) headers["x-aks-member"] = t;
      const r = await fetch("/api/public/account", {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = (await r.json().catch(() => ({}))) as ApiResult;
      if (!r.ok && !data.code && !data.error) {
        data.code = r.status === 429 ? "rate_limited" : r.status === 503 ? "unavailable" : "server_error";
      }
      return data;
    } catch {
      return { ok: false, code: "network" };
    }
  }, []);

  const refresh = useCallback(async () => {
    const r = await call({ action: "me" });
    if (r.ok && r.profile) {
      setProfile(r.profile);
      setDiscount(typeof r.discount === "number" ? r.discount : 0);
      if (r.token && r.token !== tokRef.current) {
        tokRef.current = r.token;
        store.set(TOK_KEY, r.token);
      }
    } else {
      setProfile(null);
      setDiscount(0);
    }
    setReady(true);
  }, [call]);

  useEffect(() => {
    tokRef.current = store.get(TOK_KEY);
    void refresh();
  }, [refresh]);

  const setTokenLocal = useCallback((t: string | null) => {
    tokRef.current = t;
    store.set(TOK_KEY, t ?? "");
  }, []);

  const getToken = useCallback(() => tokRef.current || store.get(TOK_KEY), []);

  return (
    <Ctx.Provider value={{ ready, connected: !!profile, profile, discount, call, refresh, setTokenLocal, getToken }}>
      {children}
    </Ctx.Provider>
  );
}

/** Prix membre arrondi au billet de 500 F le plus proche (jamais au-dessus du prix affiché). */
export const withDiscount = (price: number, discount: number) =>
  discount > 0 ? Math.round((price * (1 - discount / 100)) / 500) * 500 : price;
