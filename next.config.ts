import type { NextConfig } from "next";

const securityHeaders = [
  // HTTPS obligatoire 1 an (+ sous-domaines) — préchargeable par les navigateurs
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // Anti-sniffing de type MIME
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Anti-clickjacking : aucune iframe du site possible
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Content-Security-Policy", value: [
    "default-src 'self'",
    // Next.js exige les scripts inline d'hydratation ; Meta Pixel uniquement si activé par consentement
    "script-src 'self' 'unsafe-inline' https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://connect.facebook.net https://www.facebook.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ") },
  // Référents : origine seule vers les sites tiers (wa.me, etc.)
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Désactive les API sensibles non utilisées par le site
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()" },
  // Isolement de la fenêtre (anti-fuites inter-origines)
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  // Autorise l'aperçu live proxifié (sandbox) à charger le site + HMR en dev
  allowedDevOrigins: [
    "3000-iacurtst3hhnr82g5v94d.e2b.app",
    "*.e2b.app",
  ],
  async headers() {
    if (process.env.NODE_ENV === "development") {
      // En dev/aperçu : aucun cache navigateur (évite les erreurs de chunks obsolètes après refonte)
      return [
        {
          source: "/:path*",
          headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
        },
      ];
    }
    // Production (Netlify) : en-têtes de sécurité sur tout le site
    return [
      { source: "/:path*", headers: securityHeaders },
      // Double protection : l'admin ne doit jamais être indexé
      { source: "/admin", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
