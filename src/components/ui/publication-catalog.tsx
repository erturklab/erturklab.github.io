"use client";

import { useEffect, useState } from "react";
import type { Publication } from "@/lib/publications";
import { getPublicationKey } from "@/lib/publications";
import { PublicationCard } from "./publication-card";
import { PublicationList } from "./publication-list";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    _altmetric_embed_init?: () => void;
  }
}

type CatalogTab = "featured" | "publications" | "preprints";

function initialCatalogTab(
  featured: Publication[],
  publications: Publication[],
  preprints: Publication[]
): CatalogTab {
  if (featured.length > 0) return "featured";
  if (publications.length > 0) return "publications";
  if (preprints.length > 0) return "preprints";
  return "publications";
}

export function PublicationCatalog({
  featured,
  publications,
  preprints,
  featuredDescription = "Selected peer-reviewed papers from the lab.",
  hideEmptyTabs = false,
}: {
  featured: Publication[];
  publications: Publication[];
  preprints: Publication[];
  featuredDescription?: string;
  /** When true, tabs with zero items are hidden (useful on team profiles). */
  hideEmptyTabs?: boolean;
}) {
  const allTabs: { id: CatalogTab; label: string; count: number }[] = [
    { id: "featured", label: "Featured publications", count: featured.length },
    { id: "publications", label: "All publications", count: publications.length },
    { id: "preprints", label: "All preprints", count: preprints.length },
  ];

  const tabs = hideEmptyTabs ? allTabs.filter((t) => t.count > 0) : allTabs;

  // Re-trigger Altmetric badge processing after mount (handles initial load).
  useEffect(() => {
    function tryInit() {
      if (typeof window._altmetric_embed_init === "function") {
        window._altmetric_embed_init();
      }
    }
    // Give React time to paint, then run; also retry once the script may have loaded late.
    const t1 = setTimeout(tryInit, 200);
    const t2 = setTimeout(tryInit, 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const [tab, setTab] = useState<CatalogTab>(() => {
    const visible = hideEmptyTabs ? tabs : allTabs;
    const featuredCount = visible.find((t) => t.id === "featured")?.count ?? featured.length;
    const publicationsCount = visible.find((t) => t.id === "publications")?.count ?? publications.length;
    const preprintsCount = visible.find((t) => t.id === "preprints")?.count ?? preprints.length;
    return initialCatalogTab(
      featuredCount > 0 ? featured : [],
      publicationsCount > 0 ? publications : [],
      preprintsCount > 0 ? preprints : []
    );
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-4">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              // Wait for React to render the new tab content, then re-init badges.
              setTimeout(() => {
                if (typeof window._altmetric_embed_init === "function") {
                  window._altmetric_embed_init();
                }
              }, 300);
            }}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === id
                ? "bg-[var(--secondary)] text-[var(--primary)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/50 hover:text-[var(--foreground)]"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "featured" && (
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">{featuredDescription}</p>
      )}

      {tab === "preprints" && preprints.length > 0 && (
        <p className="mt-4 text-sm text-[var(--muted-foreground)]">
          Preprints listed on bioRxiv — not peer-reviewed.
        </p>
      )}

      <div className="mt-8">
        {tab === "featured" && (
          featured.length > 0 ? (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map(({ featured: _h, type: _t, ...pub }) => (
                <PublicationCard key={getPublicationKey(pub)} {...pub} />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">No featured papers yet.</p>
          )
        )}

        {tab === "publications" && (
          publications.length > 0 ? (
            <PublicationList items={publications} />
          ) : (
            <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">No entries in this list yet.</p>
          )
        )}

        {tab === "preprints" && (
          preprints.length > 0 ? (
            <PublicationList items={preprints} />
          ) : (
            <p className="py-8 text-center text-sm text-[var(--muted-foreground)]">No entries in this list yet.</p>
          )
        )}
      </div>
    </div>
  );
}
