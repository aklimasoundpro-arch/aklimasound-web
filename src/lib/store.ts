/** Stockage sûr : localStorage peut être bloqué (iframe sandbox, navigation privée).
 *  Repli en mémoire pour ne jamais casser l'application. */
const mem = new Map<string, string>();

export const store = {
  get(k: string): string | null {
    try {
      if (typeof window === "undefined") return mem.get(k) ?? null;
      return window.localStorage.getItem(k);
    } catch {
      return mem.get(k) ?? null;
    }
  },
  set(k: string, v: string) {
    try {
      if (typeof window !== "undefined") window.localStorage.setItem(k, v);
    } catch {
      /* ignoré */
    }
    mem.set(k, v);
  },
};
