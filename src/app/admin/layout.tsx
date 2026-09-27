import type { Metadata } from "next";

// L'espace de gestion ne doit jamais être indexé par les moteurs de recherche.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
