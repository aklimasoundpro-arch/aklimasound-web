import { MetadataRoute } from "next";
import { DOMAINS } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://aklimasound.tg";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/devis`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/materiel`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/galerie`, changeFrequency: "weekly", priority: 0.7 },
    ...DOMAINS.map((d) => ({ url: `${base}/services/${d.slug}`, changeFrequency: "monthly" as const, priority: 0.85 })),
  ];
}
