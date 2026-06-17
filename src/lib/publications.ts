import { resolveProjectIdFromNote } from "./projects";
import site from "@/content/site.json";

export type PublicationType = "publication" | "preprint";

export interface Publication {
  featured?: boolean;
  type?: PublicationType;
  title: string;
  authors: string;
  journal: string;
  year: number;
  note?: string;
  status?: string;
  image?: string;
  videoId?: string;
  link?: string;
}

export function getSitePublications(): Publication[] {
  return site.publications as Publication[];
}

export function isPreprint(pub: Publication): boolean {
  return pub.type === "preprint";
}

export function sortPublicationsByYear<T extends { year: number; title?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (a.title && b.title) return a.title.localeCompare(b.title);
    return 0;
  });
}

/** Lab flagship papers only — must map to a project page with preview video. */
export function getFeaturedPublications(publications: Publication[]): Publication[] {
  return sortPublicationsByYear(
    publications.filter(
      (p) => p.featured && !isPreprint(p) && Boolean(resolveProjectIdFromNote(p.note))
    )
  );
}

export function getPublishedPublications(publications: Publication[]): Publication[] {
  return sortPublicationsByYear(publications.filter((p) => !isPreprint(p)));
}

/** Peer-reviewed papers for the All publications list — includes featured (also shown as cards). */
export function getCatalogPublications(publications: Publication[]): Publication[] {
  return getPublishedPublications(publications);
}

export function getPreprints(publications: Publication[]): Publication[] {
  return sortPublicationsByYear(publications.filter((p) => isPreprint(p)));
}

export function partitionPublications(publications: Publication[]) {
  return {
    featured: getFeaturedPublications(publications),
    publications: getCatalogPublications(publications),
    preprints: getPreprints(publications),
  };
}

/** Stable React list key — prefers normalized DOI over title+year. */
export function getPublicationKey(pub: Pick<Publication, "title" | "year" | "link">): string {
  const doi = pub.link
    ?.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i)?.[0]
    ?.toLowerCase()
    .replace(/\.(full\.pdf|abstract|pdf)$/i, "");
  if (doi) return doi;
  return `${pub.title}-${pub.year}-${pub.link ?? ""}`;
}
