import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = { title: "Publications" };
import { PublicationCatalog } from "@/components/ui/publication-catalog";
import {
  getCatalogPublications,
  getFeaturedPublications,
  getPreprints,
  getSitePublications,
} from "@/lib/publications";

export default function PublicationsPage() {
  const publications = getSitePublications();
  const featured = getFeaturedPublications(publications);
  const catalog = getCatalogPublications(publications);
  const preprints = getPreprints(publications);

  return (
    <>
      <PageHero
        label="Technology & Research · Publications"
        title="Publications"
        description="Peer-reviewed research and preprints from the Ertürk Lab — tissue clearing, spatial omics, and AI for whole-body biology."
      />
      <section className="border-t border-[var(--border)] bg-[var(--card)]/30">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <Link
            href="/research"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to research overview
          </Link>
          <PublicationCatalog featured={featured} publications={catalog} preprints={preprints} />
        </div>
      </section>
    </>
  );
}
