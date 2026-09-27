import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LEGAL_DOCS, docBySlug } from "@/lib/legal";
import LegalView from "@/components/LegalView";

export function generateStaticParams() {
  return LEGAL_DOCS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = docBySlug(slug);
  if (!doc) return {};
  return {
    title: `${doc.title.fr} — Aklimasound`,
    description: doc.intro.fr,
  };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = docBySlug(slug);
  if (!doc) notFound();
  return <LegalView slug={slug} />;
}
