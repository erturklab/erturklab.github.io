import site from "@/content/site.json";
import { formatFullName, getTeamMember, teamMembers, type TeamMember } from "./team";

/** Fold common Latin letters before ASCII normalization (e.g. Turkish ı, German ü). */
const ASCII_FOLDS: Record<string, string> = {
  "\u0131": "i",
  "\u0130": "i",
  "\u00df": "ss",
  "\u00f6": "oe",
  "\u00d6": "oe",
  "\u00fc": "ue",
  "\u00dc": "ue",
  "\u00e4": "ae",
  "\u00c4": "ae",
  "\u015f": "s",
  "\u015e": "s",
  "\u011f": "g",
  "\u011e": "g",
  "\u00e7": "c",
  "\u00c7": "c",
  "\u00f1": "n",
  "\u00d1": "n",
  "\u00f8": "o",
  "\u00d8": "o",
  "\u00e6": "ae",
  "\u00c6": "ae",
  "\u0159": "r",
  "\u0158": "r",
  "\u0142": "l",
  "\u0141": "l",
};

function foldCharacters(value: string): string {
  let result = "";
  for (const char of value) {
    result += ASCII_FOLDS[char] ?? char;
  }
  return result;
}

export function normalizeAuthorName(value: string): string {
  return foldCharacters(value)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Ambiguous or multi-variant author strings that cannot rely on last-name matching alone. */
const EXPLICIT_AUTHOR_ALIASES: Record<string, string> = {
  "ali erturk": "ali-maximilian-erturk",
  "ali ertürk": "ali-maximilian-erturk",
  "ali ertuerk": "ali-maximilian-erturk",
  "harsharan singh bhatia": "harsharan-bhatia",
  "harsharan s bhatia": "harsharan-bhatia",
  "mihail ivilinov todorov": "mihail-todorov",
  "mihail todorov": "mihail-todorov",
  "louis b kuemmerle": "louis-kuemmerle",
  "louis kuemmerle": "louis-kuemmerle",
  "laurent h a simons": "laurent-simons",
  "laurent h.a. simons": "laurent-simons",
  "laurent simons": "laurent-simons",
  "david paul minde": "david-paul-minde",
  "ceren kimna": "ceren-kimna",
  "ceren kımna": "ceren-kimna",
  "ceren k mna": "ceren-kimna",
  "luciano hoeher": "luciano-hoeher",
  "luciano hoher": "luciano-hoeher",
  "luciano höher": "luciano-hoeher",
};

function lastName(value: string): string {
  const parts = normalizeAuthorName(value).split(" ");
  return parts[parts.length - 1] ?? "";
}

function matchesByLastName(author: string, member: TeamMember): boolean {
  const authorNorm = normalizeAuthorName(author);
  const memberNorm = normalizeAuthorName(member.name);
  const authorLast = lastName(author);
  const memberLast = lastName(member.name);
  if (!authorLast || authorLast !== memberLast) return false;

  const authorFirst = authorNorm.split(" ")[0] ?? "";
  const memberFirst = memberNorm.split(" ")[0] ?? "";
  if (!authorFirst || !memberFirst) return false;

  return authorFirst[0] === memberFirst[0];
}

function isProfilePageMember(member: TeamMember | undefined): member is TeamMember {
  return member?.profileTier === "page";
}

function memberNameKeys(member: TeamMember): string[] {
  return [normalizeAuthorName(member.name), normalizeAuthorName(formatFullName(member))];
}

function buildAuthorIndex(): Map<string, string> {
  const index = new Map<string, string>();

  for (const [key, slug] of Object.entries(EXPLICIT_AUTHOR_ALIASES)) {
    index.set(normalizeAuthorName(key), slug);
  }

  for (const member of teamMembers) {
    if (!isProfilePageMember(member)) continue;

    for (const name of member.publicationAuthorNames ?? []) {
      index.set(normalizeAuthorName(name), member.slug);
    }

    for (const key of memberNameKeys(member)) {
      if (key && !index.has(key)) index.set(key, member.slug);
    }
  }

  for (const publication of site.publications) {
    for (const author of parseAuthorList(publication.authors)) {
      const key = normalizeAuthorName(author);
      if (index.has(key)) continue;

      const slug = resolveAuthorByRules(author);
      if (slug) index.set(key, slug);
    }
  }

  return index;
}

const AUTHOR_INDEX = buildAuthorIndex();

function resolveAuthorByRules(author: string): string | undefined {
  const key = normalizeAuthorName(author);
  const explicitSlug = EXPLICIT_AUTHOR_ALIASES[key];
  if (explicitSlug) {
    const member = getTeamMember(explicitSlug);
    if (isProfilePageMember(member)) return explicitSlug;
  }

  for (const member of teamMembers) {
    if (!isProfilePageMember(member)) continue;

    for (const registeredName of member.publicationAuthorNames ?? []) {
      if (normalizeAuthorName(registeredName) === key) return member.slug;
    }

    const full = normalizeAuthorName(formatFullName(member));
    const short = normalizeAuthorName(member.name);
    if (key === full || key === short) return member.slug;
    if (matchesByLastName(author, member)) return member.slug;
  }

  return undefined;
}

export function parseAuthorList(authors: string): string[] {
  return authors
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

/** Returns a team slug for matching publications/projects to a profile. */
export function resolveAuthorToTeamSlug(author: string): string | undefined {
  const key = normalizeAuthorName(author);
  const indexed = AUTHOR_INDEX.get(key);
  if (indexed) {
    const member = getTeamMember(indexed);
    if (isProfilePageMember(member)) return indexed;
  }

  return resolveAuthorByRules(author);
}

export function resolveAuthorToLinkableTeamSlug(author: string): string | undefined {
  return resolveAuthorToTeamSlug(author);
}

export function getTeamMemberForAuthor(author: string): TeamMember | undefined {
  const slug = resolveAuthorToTeamSlug(author);
  return slug ? getTeamMember(slug) : undefined;
}

export function authorProfileHref(author: string): string | undefined {
  const slug = resolveAuthorToLinkableTeamSlug(author);
  return slug ? `/team/${slug}` : undefined;
}
