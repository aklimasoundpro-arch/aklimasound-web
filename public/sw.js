/* Service worker PWA — v2 durcie :
   - n'intercepte QUE les navigations same-origin vers /admin (le site public n'est jamais mis en cache ni détourné)
   - jamais de requête tierce interceptée
   - nettoyage des anciennes versions de cache à l'activation */
const CACHE = "aks-admin-v2";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;        // aucun tiers intercepté
  if (e.request.method !== "GET") return;                 // jamais les POST/PATCH/DELETE (API)
  if (e.request.mode !== "navigate") return;              // uniquement les navigations
  if (!url.pathname.startsWith("/admin")) return;         // le site public passe toujours par le réseau

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put("/admin", copy));
        return res;
      })
      .catch(() => caches.match("/admin"))                // hors-ligne : coquille admin en repli
  );
});
