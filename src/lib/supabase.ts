/**
 * Client Supabase — EXCLUSIVEMENT côté serveur (routes API Next.js).
 * La clé service_role est secrète : elle ne passe jamais dans le navigateur,
 * jamais dans une variable NEXT_PUBLIC_*, jamais dans le bundle client.
 * RLS refuse par ailleurs tout accès direct (défense en profondeur).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Supabase est-il branché ? (variables d'environnement présentes) */
export function supaReady(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

/** Client service_role, ou null si Supabase n'est pas branché (mode démo local). */
export function supa(): SupabaseClient | null {
  if (typeof window !== "undefined") {
    throw new Error("Supabase : accès serveur uniquement — jamais dans le navigateur.");
  }
  if (!supaReady()) return null;
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}

export function supaUrl(): string {
  return process.env.SUPABASE_URL || "";
}

/**
 * Clé "apikey" pour les endpoints GoTrue (Auth) : la clé anon est le rôle standard
 * pour ces appels ; à défaut la clé service_role est acceptée. Les deux restent
 * côté serveur — rien n'est exposé au client.
 */
export function authApiKey(): string {
  return process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || "";
}
