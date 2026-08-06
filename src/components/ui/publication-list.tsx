import { ExternalLink } from "lucide-react";
import { extractDoi, getPublicationKey } from "@/lib/publications";
import { PublicationAuthors } from "./publication-authors";

export interface PublicationListItem {
  title: string;
  authors: string;
  journal: string;
  year: number;
  link?: string;
  note?: string;
  status?: string;
}

export function PublicationList({ items }: { items: PublicationListItem[] }) {
  return (
    <div className="space-y-0">
      {items.map((pub) => {
        const doi = extractDoi(pub.link);
        return (
          <article
            key={getPublicationKey(pub)}
            className="group border-b border-[var(--border)] py-6 first:pt-0 last:border-b-0 transition-colors"
          >
            <div className="flex items-start gap-4">
              {/* Year */}
              <span className="shrink-0 w-12 text-sm font-medium tabular-nums text-[var(--primary)]">
                {pub.year}
              </span>

              {/* Content */}
              <div className="min-w-0 flex-1">
                {pub.link ? (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-start gap-1.5 text-base font-medium leading-snug text-[var(--foreground)] transition-colors hover:text-[var(--primary)] hover:underline underline-offset-4"
                  >
                    <span>{pub.title}</span>
                    <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--primary)] opacity-70" aria-hidden />
                  </a>
                ) : (
                  <p className="text-base font-medium leading-snug">{pub.title}</p>
                )}
                <PublicationAuthors authors={pub.authors} className="mt-2" />
                <p className="mt-1 text-sm italic text-[var(--muted-foreground)]">
                  {pub.journal}
                  {pub.note ? ` · ${pub.note}` : ""}
                </p>
              </div>

              {/* Altmetric badge — right column, ~53 px visible */}
              <div className="shrink-0 self-center" style={{ width: 53, height: 53 }}>
                {doi && (
                  <div
                    className="altmetric-embed"
                    data-badge-type="donut"
                    data-doi={doi}
                    data-condensed="true"
                    data-hide-no-mentions="true"
                    data-link-target="_blank"
                    style={{
                      transform: "scale(0.82)",
                      transformOrigin: "top left",
                      width: 64,
                      height: 64,
                      display: "block",
                    }}
                  />
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
