import site from "@/content/site.json";
import projectMedia from "@/content/project-media.json";
import type { Technology } from "@/components/ui/technology-showcase";
import {
  authorProfileHref,
  normalizeAuthorName,
  parseAuthorList,
  resolveAuthorToTeamSlug,
} from "./author-links";
import type { Publication } from "./publications";
import { partitionPublications, sortPublicationsByYear } from "./publications";
import { getTeamMember, type TeamMember } from "./team";

export type Project = Technology & {
  teamSlugs?: string[];
};

const NOTE_TO_PROJECT: Record<string, string> = {
  "scp nano": "scp-nano",
  wilddisco: "wilddisco",
  "wilddisco cover": "wilddisco",
  "disco ms": "disco-ms",
  "disco ms cover": "disco-ms",
  "disco seq": "disco-ms",
  shanel: "shanel",
  deepmact: "deepmact",
  "deepmact cover": "deepmact",
  "vdisco cover": "deepmact",
  mousemapper: "mousemapper",
  vessap: "vessap",
  lipigo: "scp-nano",
  "udisco cover": "wilddisco",
};

const PROJECT_DOI_TO_ID: Record<string, string> = Object.fromEntries(
  (site.technologies as Project[])
    .map((project) => {
      const doi = extractDoi(project.link);
      return doi ? ([doi, project.id] as const) : undefined;
    })
    .filter((entry): entry is [string, string] => Boolean(entry))
);

function extractDoi(url?: string): string | undefined {
  if (!url) return undefined;
  const match = url.match(/10\.\d{4,9}\/[-._;()/:A-Z0-9]+/i);
  return match?.[0].toLowerCase();
}

function normalizeNote(note?: string): string {
  return (note ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseProjectYear(journal: string): number {
  const match = journal.match(/(\d{4})\s*$/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export function sortProjectsByYear<T extends { journal: string; name: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const yearDiff = parseProjectYear(b.journal) - parseProjectYear(a.journal);
    if (yearDiff !== 0) return yearDiff;
    return a.name.localeCompare(b.name);
  });
}

export function getProjects(): Project[] {
  const mediaById = projectMedia as Record<string, Technology["media"]>;
  return sortProjectsByYear(
    (site.technologies as Project[]).map((project) => ({
      ...project,
      media: mediaById[project.id] ?? project.media,
    }))
  );
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((project) => project.id === id);
}

export function projectHref(id: string): string {
  return `/research/projects/${id}`;
}

/** Resolve a project id from a publication note — no media requirement. */
export function resolveProjectIdFromNoteRaw(note?: string): string | undefined {
  if (!note) return undefined;
  const key = normalizeNote(note);

  let candidate = NOTE_TO_PROJECT[key];
  if (!candidate) {
    for (const project of getProjects()) {
      const projectName = normalizeNote(project.name);
      if (key.includes(projectName) || projectName.includes(key)) {
        candidate = project.id;
        break;
      }
    }
  }

  return candidate && getProject(candidate) ? candidate : undefined;
}

/** Featured cards and previews — project must have preview media. */
export function resolveProjectIdFromNote(note?: string): string | undefined {
  const candidate = resolveProjectIdFromNoteRaw(note);
  if (!candidate) return undefined;
  const project = getProject(candidate);
  if (!project?.media?.length) return undefined;
  return candidate;
}

/** Link a publication to a lab project via note or flagship DOI. */
export function resolveProjectIdFromPublication(pub: Pick<Publication, "note" | "link">): string | undefined {
  const fromNote = resolveProjectIdFromNoteRaw(pub.note);
  if (fromNote) return fromNote;

  const doi = extractDoi(pub.link);
  if (doi && PROJECT_DOI_TO_ID[doi]) return PROJECT_DOI_TO_ID[doi];

  return undefined;
}

export function getPublicationsForProject(projectId: string): Publication[] {
  const publications = site.publications as Publication[];
  return sortPublicationsByYear(
    publications.filter((pub) => resolveProjectIdFromPublication(pub) === projectId)
  );
}

export function getTeamMembersForProject(projectId: string): TeamMember[] {
  const project = getProject(projectId);
  const slugs = new Set<string>();

  project?.teamSlugs?.forEach((slug) => slugs.add(slug));

  for (const pub of site.publications as Publication[]) {
    if (resolveProjectIdFromPublication(pub) !== projectId) continue;
    for (const author of parseAuthorList(pub.authors)) {
      const slug = resolveAuthorToTeamSlug(author);
      if (slug) slugs.add(slug);
    }
  }

  return [...slugs]
    .map((slug) => getTeamMember(slug))
    .filter((member): member is TeamMember => Boolean(member && member.profileTier === "page"));
}

function authorBelongsToMember(author: string, slug: string): boolean {
  const member = getTeamMember(slug);
  const registered = new Set(
    (member?.publicationAuthorNames ?? []).map((name) => normalizeAuthorName(name))
  );
  if (registered.has(normalizeAuthorName(author))) return true;
  return resolveAuthorToTeamSlug(author) === slug;
}

export function getProjectsForTeamMember(slug: string): Project[] {
  const projectIds = new Set<string>();

  for (const pub of getPublicationsForTeamMember(slug)) {
    const projectId = resolveProjectIdFromPublication(pub);
    if (projectId) projectIds.add(projectId);
  }

  for (const project of getProjects()) {
    if (project.teamSlugs?.includes(slug)) projectIds.add(project.id);
  }

  return sortProjectsByYear(getProjects().filter((project) => projectIds.has(project.id)));
}

export function getPublicationsForTeamMember(slug: string): Publication[] {
  const publications = site.publications as Publication[];
  return sortPublicationsByYear(
    publications.filter((pub) =>
      parseAuthorList(pub.authors).some((author) => authorBelongsToMember(author, slug))
    )
  );
}

/** Featured / all publications / preprints for a team profile — same split as /publications. */
export function getPublicationCatalogForTeamMember(slug: string) {
  return partitionPublications(getPublicationsForTeamMember(slug));
}

export function publicationProjectHref(
  note?: string,
  link?: string
): string | undefined {
  const projectId = resolveProjectIdFromPublication({ note, link });
  return projectId ? projectHref(projectId) : undefined;
}

export function getProjectForPublication(pub: Pick<Publication, "note" | "link">) {
  const projectId = resolveProjectIdFromPublication(pub);
  return projectId ? getProject(projectId) : undefined;
}

/** @deprecated Use getProjectForPublication */
export function getProjectForPublicationNote(note?: string) {
  return getProjectForPublication({ note });
}

export { authorProfileHref };
