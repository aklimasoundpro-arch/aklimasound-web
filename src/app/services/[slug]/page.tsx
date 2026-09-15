import { notFound } from "next/navigation";
import { DOMAINS } from "@/lib/data";
import ServiceView from "@/components/ServiceView";

export function generateStaticParams() {
  return DOMAINS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = DOMAINS.find((x) => x.slug === slug);
  if (!d) return {};
  return {
    title: `${d.name.fr} — formules & tarifs Aklimasound`,
    description: `${d.tagline.fr} Formules de ${d.offers[0].price?.toLocaleString("fr-FR") ?? "300 000"} FCFA et plus. Devis gratuit, réservation Mobile Money.`,
    openGraph: { title: `${d.name.fr} | Aklimasound`, images: [d.hero] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const domain = DOMAINS.find((d) => d.slug === slug);
  if (!domain) notFound();
  return <ServiceView domain={domain} />;
}
