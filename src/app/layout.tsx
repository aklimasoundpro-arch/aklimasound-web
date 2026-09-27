import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/lib/i18n";
import { MemberProvider } from "@/lib/member";
import { WaProvider } from "@/components/WaGate";
import { SiteTracker } from "@/components/SiteTracker";
import { MetaPixel } from "@/components/MetaPixel";
import { CookieBanner } from "@/components/CookieBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://aklimasound.tg"),
  manifest: "/manifest.webmanifest",
  title: {
    default: "Aklimasound — Sonorisation professionnelle, vente & installation au Togo",
    template: "%s | Aklimasound",
  },
  description:
    "Sonorisation haute fidélité pour concerts, chorales, mariages, entreprises et cultes, partout au Togo. Vente & installation fixe de matériel audio pro. Devis gratuit, réservation Mobile Money.",
  keywords: ["sonorisation Lomé", "location sono Togo", "sonorisation mariage Lomé", "sonorisation église Togo", "line array Lomé", "vente matériel son Togo", "Aklimasound"],
  openGraph: {
    title: "Aklimasound — La passion du son",
    description: "Sonorisation professionnelle, vente & installation de matériel audio, partout au Togo.",
    images: ["/img/hero-eglise.jpg"],
    locale: "fr_FR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Aklimasound",
  slogan: "La passion du son",
  description: "Sonorisation événementielle, vente & installation fixe de matériel audio et studio de production musicale à Lomé, Togo.",
  telephone: "+22897675764",
  email: "aklimasoundpro@gmail.com",
  address: { "@type": "PostalAddress", addressLocality: "Lomé", addressCountry: "TG" },
  areaServed: { "@type": "Country", name: "Togo" },
  sameAs: ["https://tiktok.com/@aklimasoundpro", "https://instagram.com/aklimasoundpro"],
  makesOffer: {
    "@type": "OfferCatalog",
    name: "Sonorisation événementielle",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sonorisation concerts & chorales" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sonorisation mariages & réceptions" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sonorisation entreprises & institutions" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Installation fixe églises, salles & HORECA" } },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-motif antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        <LangProvider>
          <WaProvider>
            <MemberProvider>
              <SiteTracker />
              <MetaPixel />
              {children}
              <CookieBanner />
            </MemberProvider>
          </WaProvider>
        </LangProvider>
      </body>
    </html>
  );
}
