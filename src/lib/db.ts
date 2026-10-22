/**
 * Couche de données Aklimasound — adaptateur double mode :
 *  • Supabase branché (SUPABASE_URL + SUPABASE_SERVICE_KEY) → persistance réelle,
 *    accès 100 % serveur avec la clé service_role ; RLS refuse tout accès direct.
 *  • Sinon → fichier JSON local (data/db.json) pour la démo/preview.
 * Importé UNIQUEMENT par les route handlers serveur (jamais côté client).
 */
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { supa } from "./supabase";

const FILE = join(process.cwd(), "data", "db.json");
export const COOKIE = "aks_admin";
export const MEMBER_COOKIE = "aks_member";
export const DEFAULT_PASSWORD = "Aklima@2026"; // à changer dans Réglages après 1ère connexion

export type Row = Record<string, unknown> & { id: string; createdAt: string };
export type DB = {
  settings: { passHash: string; passSalt: string; secret: string; memberSecret?: string; memberDiscount: number };
  leads: Row[];
  quotes: Row[];
  bookings: Row[];
  products: Row[];
  notifications: Row[];
  events: Row[];
};
export type Col = "leads" | "quotes" | "bookings" | "products" | "notifications" | "events";

const uid = () => Date.now().toString(36) + randomBytes(3).toString("hex");
const days = (n: number) => new Date(Date.now() + n * 864e5).toISOString();

/* ============================ MODE LOCAL (démo) ============================ */

function seed(): DB {
  const passSalt = randomBytes(16).toString("hex");
  return {
    settings: {
      passHash: scryptSync(DEFAULT_PASSWORD, passSalt, 32).toString("hex"),
      passSalt,
      secret: randomBytes(32).toString("hex"),
      memberSecret: randomBytes(32).toString("hex"),
      memberDiscount: 10,
    },
    leads: [
      { id: uid(), createdAt: days(-1), name: "K. Agbeko", phone: "+228 90 12 34 56", email: "agbeko@mail.tg", source: "popup réduction" },
      { id: uid(), createdAt: days(-2), name: "Sœur Mensah", phone: "+228 91 23 45 67", email: "", source: "WhatsApp (porte)" },
    ],
    quotes: [
      { id: uid(), createdAt: days(-0.02), name: "M. Mensah", phone: "+228 92 34 56 78", email: "mensah@mail.tg", domain: "Mariages", offer: "Pack Pro", date: days(27).slice(0, 10), place: "Lomé — Bè-Kpota", total: 450000, source: "formulaire", status: "nouveau", msg: "300 invités, plein air." },
      { id: uid(), createdAt: days(-1), name: "ORABANK RH", phone: "+228 93 45 67 89", email: "rh@orabank.example", domain: "Entreprises", offer: "Pack Conférence", date: days(13).slice(0, 10), place: "Lomé — hôtel Sarakawa", total: 0, source: "simulateur", status: "nouveau", msg: "Séminaire 2 jours, captation souhaitée." },
    ],
    bookings: [
      { id: uid(), createdAt: days(-3), customer: "Chorale Écho de Vie", phone: "+228 94 56 78 90", domain: "Religieux", offer: "Pack Pro", date: days(20).slice(0, 10), place: "Kara", total: 440000, depositRate: 50, proofRef: "FLOOZ-98213", status: "deposit_proof", channel: "WhatsApp" },
      { id: uid(), createdAt: days(-6), customer: "Convention ADRA", phone: "+228 95 67 89 01", domain: "Religieux", offer: "Pack Premium", date: days(34).slice(0, 10), place: "Atakpamé", total: 850000, depositRate: 30, proofRef: "MIXX-55120", status: "confirmed", channel: "WhatsApp" },
      { id: uid(), createdAt: days(-10), customer: "Bar Le Wok", phone: "+228 96 78 90 12", domain: "HORECA", offer: "Installation fixe — salle 120", date: days(-2).slice(0, 10), place: "Lomé — Dékon", total: 1250000, depositRate: 50, proofRef: "MIXX-54988", status: "done", channel: "site" },
      { id: uid(), createdAt: days(-4), customer: "Culte « Le Roi de Gloire »", phone: "+228 97 89 01 23", domain: "Religieux", offer: "Pack Basique", date: new Date().toISOString().slice(0, 10), place: "Lomé — Adidogomé", total: 260000, depositRate: 30, proofRef: "MIXX-55401", status: "ongoing", channel: "WhatsApp" },
    ],
    products: [
      { id: uid(), createdAt: days(-30), name: "Enceinte line array L1200", cat: "Façade", price: 950000, stock: 4, status: "disponible" },
      { id: uid(), createdAt: days(-30), name: "Caisson de basse SB18", cat: "Basses", price: 690000, stock: 2, status: "disponible" },
      { id: uid(), createdAt: days(-30), name: "Retour de scène SM-12", cat: "Retours", price: 420000, stock: 3, status: "disponible" },
      { id: uid(), createdAt: days(-30), name: "Table de mixage numérique 32 ch", cat: "Régie", price: 1150000, stock: 1, status: "disponible" },
      { id: uid(), createdAt: days(-20), name: "Micro sans fil double (UHF)", cat: "Micros", price: 240000, stock: 2, status: "commande" },
      { id: uid(), createdAt: days(-20), name: "Pack studio home-starter", cat: "Studio", price: 780000, stock: 1, status: "disponible" },
      { id: uid(), createdAt: days(-12), name: "Ampli 4 × 1200 W", cat: "Amplis", price: 520000, stock: 0, status: "rupture" },
      { id: uid(), createdAt: days(-12), name: "Câblage XLR pro (lot 6 × 15 m)", cat: "Accessoires", price: 135000, stock: 6, status: "disponible" },
    ],
    notifications: [
      { id: uid(), createdAt: days(-0.01), icon: "file", title: "Nouvelle demande de devis — Pack Pro (Mariages)", hot: true, read: false },
      { id: uid(), createdAt: days(-0.03), icon: "check", title: "Preuve d'acompte à valider — Chorale Écho (220 000 F × 50 %)", hot: true, read: false },
      { id: uid(), createdAt: days(-0.1), icon: "clock", title: "Rappel J-1 : culte « Le Roi de Gloire » — matériel à sortir", hot: true, read: false },
      { id: uid(), createdAt: days(-0.2), icon: "badge", title: "Nouveau membre inscrit (réduction activée) : K. Agbeko", hot: false, read: false },
      { id: uid(), createdAt: days(-1), icon: "wrench", title: "Maintenance planifiée : caisson n°3 (membrane)", hot: false, read: true },
    ],
    events: [],
  };
}

let cache: DB | null = null;
function db(): DB {
  if (!cache) {
    try {
      cache = existsSync(FILE) ? (JSON.parse(readFileSync(FILE, "utf8")) as DB) : seed();
      if (!cache.settings?.secret) cache.settings.secret = randomBytes(32).toString("hex");
      if (!cache.settings?.memberSecret) cache.settings.memberSecret = randomBytes(32).toString("hex");
      if (!Array.isArray(cache.events)) cache.events = [];
    } catch {
      cache = seed();
    }
    persist();
  }
  return cache;
}
function persist() {
  if (!cache || supa()) return; // jamais d'écriture locale quand Supabase est branché
  try {
    mkdirSync(dirname(FILE), { recursive: true });
    writeFileSync(FILE, JSON.stringify(cache, null, 2));
  } catch {
    /* Système de fichiers en lecture seule : mode mémoire (démo). */
  }
}

/* ==================== Bascules camelCase ↔ snake_case ==================== */

const snake = (k: string) => k.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
const camel = (k: string) => k.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
const toSupa = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [snake(k), v]));
const fromSupa = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [camel(k), v])) as Row;

const DANGER = new Set(["__proto__", "constructor", "prototype"]);

function cleanRow(row: Record<string, unknown>, keepId = false): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (DANGER.has(k)) continue;
    if (!keepId && (k === "id" || k === "createdAt")) continue; // champs immuables côté serveur
    if (keepId && (k === "id" || k === "createdAt" || k === "updatedAt")) continue;
    out[k] = v;
  }
  return out;
}

/* ============================ CRUD unifié ============================ */

export async function listRows(col: Col, limit = 500): Promise<Row[]> {
  const s = supa();
  if (s) {
    const { data, error } = await s
      .from(col)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(col === "events" ? 5000 : limit);
    if (error) throw new Error(`list ${col}: ${error.message}`);
    return ((data ?? []) as Record<string, unknown>[]).map(fromSupa);
  }
  return db()[col].slice(0, col === "events" ? 5000 : limit);
}

export async function addRow(col: Col, row: Record<string, unknown>, cap = 500): Promise<Row> {
  const clean = cleanRow(row);
  const s = supa();
  if (s) {
    const { data, error } = await s.from(col).insert(toSupa(clean)).select().single();
    if (error) throw new Error(`insert ${col}: ${error.message}`);
    return fromSupa(data as Record<string, unknown>);
  }
  const d = db();
  // id/createdAt APRÈS le spread : le client ne peut jamais les écraser
  const full = { ...clean, id: uid(), createdAt: new Date().toISOString() } as Row;
  d[col].unshift(full);
  if (d[col].length > cap) d[col].length = cap;
  persist();
  return full;
}

export async function patchRow(col: Col, id: string, patch: Record<string, unknown>): Promise<Row | null> {
  const clean = cleanRow(patch, true);
  const s = supa();
  if (s) {
    const { data, error } = await s.from(col).update(toSupa(clean)).eq("id", id).select().single();
    if (error) {
      if (error.code === "PGRST116") return null; // aucune ligne → introuvable
      throw new Error(`patch ${col}: ${error.message}`);
    }
    return fromSupa(data as Record<string, unknown>);
  }
  const d = db();
  const r = d[col].find((x) => x.id === id);
  if (!r) return null;
  for (const [k, v] of Object.entries(clean)) (r as Record<string, unknown>)[k] = v;
  persist();
  return r;
}

export async function delRow(col: Col, id: string): Promise<boolean> {
  const s = supa();
  if (s) {
    const { data, error } = await s.from(col).delete().eq("id", id).select("id");
    if (error) throw new Error(`delete ${col}: ${error.message}`);
    return (data ?? []).length > 0;
  }
  const d = db();
  const i = d[col].findIndex((x) => x.id === id);
  if (i < 0) return false;
  d[col].splice(i, 1);
  persist();
  return true;
}

export async function notify(title: string, icon = "zap", hot = true) {
  const s = supa();
  if (s) {
    const { error } = await s.from("notifications").insert({ icon, title: title.slice(0, 200), hot, read: false });
    if (error) throw new Error(`notify: ${error.message}`);
    return;
    // Phase suivante : envoi Brevo API ici pour les notifications critiques (devis, acompte, J-1).
  }
  db().notifications.unshift({ id: uid(), createdAt: new Date().toISOString(), icon, title, hot, read: false } as Row);
  persist();
}

/* ============================ Réglages ============================ */

export type Settings = {
  passHash: string;
  passSalt: string;
  adminSecret: string;
  memberSecret: string;
  memberDiscount: number;
};
let sCache: Settings | null = null;

export async function getSettings(): Promise<Settings> {
  if (sCache) return sCache;
  const s = supa();
  if (s) {
    let { data } = await s.from("settings").select("*").eq("id", 1).maybeSingle();
    if (!data) {
      await s.from("settings").insert({ id: 1 });
      ({ data } = await s.from("settings").select("*").eq("id", 1).maybeSingle());
    }
    const st = (data ?? {}) as Record<string, unknown>;
    const patch: Record<string, string> = {};
    if (!st.pass_hash || !st.pass_salt) {
      const salt = randomBytes(16).toString("hex");
      patch.pass_salt = salt;
      patch.pass_hash = scryptSync(DEFAULT_PASSWORD, salt, 32).toString("hex");
    }
    if (!st.admin_secret) patch.admin_secret = randomBytes(32).toString("hex");
    if (!st.member_secret) patch.member_secret = randomBytes(32).toString("hex");
    if (Object.keys(patch).length) await s.from("settings").update(patch).eq("id", 1);
    sCache = {
      passHash: String(patch.pass_hash ?? st.pass_hash ?? ""),
      passSalt: String(patch.pass_salt ?? st.pass_salt ?? ""),
      adminSecret: String(patch.admin_secret ?? st.admin_secret ?? ""),
      memberSecret: String(patch.member_secret ?? st.member_secret ?? ""),
      memberDiscount: Number(st.member_discount ?? 10),
    };
    return sCache;
  }
  const st = db().settings;
  sCache = {
    passHash: st.passHash,
    passSalt: st.passSalt,
    adminSecret: st.secret,
    memberSecret: st.memberSecret!,
    memberDiscount: st.memberDiscount,
  };
  return sCache;
}

export async function setMemberDiscount(n: number) {
  const s = supa();
  if (s) await s.from("settings").update({ member_discount: n }).eq("id", 1);
  else {
    db().settings.memberDiscount = n;
    persist();
  }
  if (sCache) sCache.memberDiscount = n;
}

/* ====================== Authentification admin (scrypt) ====================== */

export function hashPass(pass: string, salt: string) {
  return scryptSync(pass, salt, 32).toString("hex");
}

export async function verifyPass(pass: string): Promise<boolean> {
  const { passHash, passSalt } = await getSettings();
  const h = Buffer.from(hashPass(pass, passSalt), "hex");
  const t = Buffer.from(passHash, "hex");
  return h.length === t.length && timingSafeEqual(h, t);
}

export async function setPassword(pass: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = hashPass(pass, salt);
  const s = supa();
  if (s) await s.from("settings").update({ pass_salt: salt, pass_hash: hash }).eq("id", 1);
  else {
    const st = db().settings;
    st.passSalt = salt;
    st.passHash = hash;
    persist();
  }
  if (sCache) {
    sCache.passSalt = salt;
    sCache.passHash = hash;
  }
}

/* ============================ Jetons signés (HMAC) ============================ */

const sign = (secret: string, msg: string) => createHmac("sha256", secret).update(msg).digest("hex");
const safeEqual = (a: string, b: string) => {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  return ba.length === bb.length && timingSafeEqual(ba, bb);
};

export async function makeToken(): Promise<string> {
  const { adminSecret } = await getSettings();
  const exp = Date.now() + 7 * 864e5; // 7 jours
  return `${exp}.${sign(adminSecret, String(exp))}`;
}

export async function verifyToken(tok: string | undefined): Promise<boolean> {
  if (!tok) return false;
  const [exp, sig] = tok.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const { adminSecret } = await getSettings();
  return safeEqual(sig, sign(adminSecret, exp));
}

/** Jeton membre : `{userId}.{exp}.{sig}` — 30 jours, secret distinct de l'admin. */
export async function makeMemberToken(userId: string): Promise<string> {
  const { memberSecret } = await getSettings();
  const exp = Date.now() + 30 * 864e5;
  return `${userId}.${exp}.${sign(memberSecret, `${userId}.${exp}`)}`;
}

export async function verifyMemberToken(tok: string | undefined): Promise<string | null> {
  if (!tok) return null;
  const parts = tok.split(".");
  if (parts.length !== 3) return null;
  const [userId, exp, sig] = parts;
  if (!userId || !exp || !sig || Number(exp) < Date.now()) return null;
  if (!/^[0-9a-fA-F-]{36}$/.test(userId)) return null; // UUID attendu
  const { memberSecret } = await getSettings();
  return safeEqual(sig, sign(memberSecret, `${userId}.${exp}`)) ? userId : null;
}

/* ==================== Anti-spam public (limiteur mémoire) ==================== */

const hits = new Map<string, { n: number; t: number }>();
export function rateReset(key: string) {
  hits.delete(key);
}
export function rateOk(key: string, max = 6, windowMs = 60_000): boolean {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || now - h.t > windowMs) {
    hits.set(key, { n: 1, t: now });
    return true;
  }
  h.n += 1;
  return h.n <= max;
}

/**
 * Limitation de débit PARTAGÉE : compteur stocké dans Supabase (table rate_limits),
 * donc commun à tous les isolats serverless Netlify — contrairement à la mémoire
 * locale qui se vidait à chaque isolate. Repli mémoire si Supabase injoignable.
 */
export async function rateOkDb(key: string, max = 6, windowMs = 60_000): Promise<boolean> {
  const s = supa();
  if (!s) return rateOk(key, max, windowMs);
  try {
    const now = Date.now();
    const { data } = await s.from("rate_limits").select("n,t").eq("key", key).maybeSingle();
    const row = data as { n: number; t: string } | null;
    if (!row || now - new Date(row.t).getTime() > windowMs) {
      await s.from("rate_limits").upsert({ key, n: 1, t: new Date(now).toISOString() });
      if (Math.random() < 0.05) {
        await s.from("rate_limits").delete().lt("t", new Date(now - 3_600_000).toISOString());
      }
      return true;
    }
    const n = row.n + 1;
    await s.from("rate_limits").update({ n }).eq("key", key);
    return n <= max;
  } catch {
    return rateOk(key, max, windowMs);
  }
}

/**
 * IP client fiable : la DERNIÈRE valeur de X-Forwarded-For est celle ajoutée par le
 * proxy le plus proche (edge Netlify). Les valeurs précédentes sont contrôlables par
 * le client → les ignorer empêche le contournement des quotas par rotation d'IP forgées.
 */
export function ipOf(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (!xff) return "local";
  const ip = xff.split(",").pop()?.trim() ?? "";
  return /^[0-9a-fA-F.:]{7,45}$/.test(ip) ? ip : "local";
}
