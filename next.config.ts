import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autorise l'aperçu live proxifié (sandbox) à charger le site + HMR en dev
  allowedDevOrigins: [
    "3000-iacurtst3hhnr82g5v94d.e2b.app",
    "*.e2b.app",
  ],
  // En dev/aperçu uniquement : aucun cache navigateur sur les chunks JS/CSS/HTML
  // (évite les erreurs "module factory not available" après refonte).
  // En production, on laisse le CDN Netlify mettre en cache normalement.
  ...(process.env.NODE_ENV === "development"
    ? {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
            },
          ];
        },
      }
    : {}),
};

export default nextConfig;
