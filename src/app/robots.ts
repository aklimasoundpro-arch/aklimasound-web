import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/connexion", "/admin"] }],
    sitemap: "https://aklimasound.tg/sitemap.xml",
  };
}
