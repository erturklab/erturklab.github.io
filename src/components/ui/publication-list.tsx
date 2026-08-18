import { ExternalLink } from "lucide-react";
import { extractDoi, getPublicationKey } from "@/lib/publications";
import { PublicationAuthors } from "./publication-authors";
import { AltmetricBadge } from "./altmetric-badge";

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

              {/* Content — always stops at the badge column so titles wrap at the same width */}
              <div className="min-w-0 flex-1">
                {pub.link ? (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start gap-1.5 text-base font-medium leading-snug text-[var(--foreground)] transition-colors hover:text-[var(--primary)] hover:underline underline-offset-4"
                  >
                    <span className="min-w-0">{pub.title}</span>
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

              <div className="flex w-28 shrink-0 justify-end self-center">
                <div className="w-[53px]">
                  <AltmetricBadge doi={doi} />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
