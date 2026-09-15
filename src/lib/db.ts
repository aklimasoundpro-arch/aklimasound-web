/**
 * Base locale Aklimasound — fichier JSON persistant (data/db.json).
 * Importé UNIQUEMENT par les route handlers serveur (jamais côté client).
 * Phase 1b : cette couche sera remplacée par Supabase sans toucher aux pages.
 */
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";

const FILE = join(process.cwd(), "data", "db.json");
export const COOKIE = "aks_admin";
export const DEFAULT_PASSWORD = "Aklima@2026"; // à changer dans Réglages après 1ère connexion

export type Row = Record<string, unknown> & { id: string; createdAt: string };
export type DB = {
  settings: { passHash: string; passSalt: string; secret: string; memberDiscount: number };
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

function seed(): DB {
  const passSalt = randomBytes(16).toString("hex");
  return {
    settings: {
      passHash: scryptSync(DEFAULT_PASSWORD, passSalt, 32).toString("hex"),
      passSalt,
      secret: randomBytes(32).toString("hex"),
      memberDiscount: 10,
    },
    leads: [
      { id: uid(), createdAt: days(-1), name: "K. Agbeko", phone: "+228 90 12 34 56", email: "agbeko@mail.tg", source: "popup réduction" },
      { id: uid(), createdAt: days(-2), name: "Sœur Mensah", phone: "+228 91 23 45 67", email: "", source: "WhatsApp (porte)" },
    ],
    quotes: [
      { id: uid(), createdAt: days(-0.02), name: "M. Mensah", phone: "+228 92 34 56 78", email: "mensah@mail.tg", domain: "Mariages", offer: "Pack Noces d'Or", date: days(27).slice(0, 10), place: "Lomé — Bè-Kpota", total: 450000, source: "formulaire", status: "nouveau", msg: "300 invités, plein air." },
      { id: uid(), createdAt: days(-1), name: "ORABANK RH", phone: "+228 93 45 67 89", email: "rh@orabank.example", domain: "Entreprises", offer: "Pack Conférence", date: days(13).slice(0, 10), place: "Lomé — hôtel Sarakawa", total: 0, source: "simulateur", status: "nouveau", msg: "Séminaire 2 jours, captation souhaitée." },
    ],
    bookings: [
      { id: uid(), createdAt: days(-3), customer: "Chorale Écho de Vie", phone: "+228 94 56 78 90", domain: "Religieux", offer: "Pack Croisade & Louange", date: days(20).slice(0, 10), place: "Kara", total: 440000, depositRate: 50, proofRef: "FLOOZ-98213", status: "deposit_proof", channel: "WhatsApp" },
      { id: uid(), createdAt: days(-6), customer: "Convention ADRA", phone: "+228 95 67 89 01", domain: "Religieux", offer: "Pack Convention", date: days(34).slice(0, 10), place: "Atakpamé", total: 850000, depositRate: 30, proofRef: "MIXX-55120", status: "confirmed", channel: "WhatsApp" },
      { id: uid(), createdAt: days(-10), customer: "Bar Le Wok", phone: "+228 96 78 90 12", domain: "HORECA", offer: "Installation fixe — salle 120", date: days(-2).slice(0, 10), place: "Lomé — Dékon", total: 1250000, depositRate: 50, proofRef: "MIXX-54988", status: "done", channel: "site" },
      { id: uid(), createdAt: days(-4), customer: "Culte « Le Roi de Gloire »", phone: "+228 97 89 01 23", domain: "Religieux", offer: "Pack Dimanche Live", date: new Date().toISOString().slice(0, 10), place: "Lomé — Adidogomé", total: 260000, depositRate: 30, proofRef: "MIXX-55401", status: "ongoing", channel: "WhatsApp" },
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
      { id: uid(), createdAt: days(-0.01), icon: "file", title: "Nouvelle demande de devis — Pack Noces d'Or (Mariages)", hot: true, read: false },
      { id: uid(), createdAt: days(-0.03), icon: "check", title: "Preuve d'acompte à valider — Chorale Écho (220 000 F × 50 %)", hot: true, read: false },
      { id: uid(), createdAt: days(-0.1), icon: "clock", title: "Rappel J-1 : culte « Le Roi de Gloire » — matériel à sortir", hot: true, read: false },
      { id: uid(), createdAt: days(-0.2), icon: "badge", title: "Nouveau membre inscrit (réduction activée) : K. Agbeko", hot: false, read: false },
      { id: uid(), createdAt: days(-1), icon: "wrench", title: "Maintenance planifiée : caisson n°3 (membrane)", hot: false, read: true },
    ],
    events: [],
  };
}

let cache: DB | null = null;
export function db(): DB {
  if (!cache) {
    try {
      cache = existsSync(FILE) ? (JSON.parse(readFileSync(FILE, "utf8")) as DB) : seed();
      if (!cache.settings?.secret) cache.settings.secret = randomBytes(32).toString("hex");
      if (!Array.isArray(cache.events)) cache.events = []; // migration des bases créées avant le tracking
    } catch {
      cache = seed();
    }
    persist();
  }
  return cache;
}
export function persist() {
  if (!cache) return;
  try {
    mkdirSync(dirname(FILE), { recursive: true });
    writeFileSync(FILE, JSON.stringify(cache, null, 2));
  } catch {
    /* Système de fichiers en lecture seule (Netlify/serverless) :
       l'admin fonctionne alors en mode mémoire — non persistant.
       La persistance réelle arrive avec Supabase (phase 1b). */
  }
}
export function addRow(col: Col, row: Record<string, unknown>, cap = 500): Row {
  const d = db();
  const full = { id: uid(), createdAt: new Date().toISOString(), ...row } as Row;
  d[col].unshift(full);
  if (d[col].length > cap) d[col].length = cap;
  persist();
  return full;
}
export function patchRow(col: Col, id: string, patch: Record<string, unknown>): Row | null {
  const d = db();
  const r = d[col].find((x) => x.id === id);
  if (!r) return null;
  Object.assign(r, patch);
  persist();
  return r;
}
export function delRow(col: Col, id: string): boolean {
  const d = db();
  const i = d[col].findIndex((x) => x.id === id);
  if (i < 0) return false;
  d[col].splice(i, 1);
  persist();
  return true;
}
export function notify(title: string, icon = "zap", hot = true) {
  db().notifications.unshift({ id: uid(), createdAt: new Date().toISOString(), icon, title, hot, read: false } as Row);
  persist();
  // Phase 1b : envoi Brevo ici pour les notifications critiques (devis, acompte, J-1).
}

/* ---------- Authentification admin ---------- */
export function hashPass(pass: string, salt: string) {
  return scryptSync(pass, salt, 32).toString("hex");
}
export function verifyPass(pass: string): boolean {
  const s = db().settings;
  const h = Buffer.from(hashPass(pass, s.passSalt), "hex");
  const t = Buffer.from(s.passHash, "hex");
  return h.length === t.length && timingSafeEqual(h, t);
}
export function setPassword(pass: string) {
  const s = db().settings;
  s.passSalt = randomBytes(16).toString("hex");
  s.passHash = hashPass(pass, s.passSalt);
  persist();
}
export function makeToken(): string {
  const exp = Date.now() + 7 * 864e5; // 7 jours
  const sig = createHmac("sha256", db().settings.secret).update(String(exp)).digest("hex");
  return `${exp}.${sig}`;
}
export function verifyToken(tok: string | undefined): boolean {
  if (!tok) return false;
  const [exp, sig] = tok.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const want = createHmac("sha256", db().settings.secret).update(exp).digest("hex");
  const a = Buffer.from(sig, "hex");
  const b = Buffer.from(want, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ---------- Anti-spam public (limiteur mémoire simple) ---------- */
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
