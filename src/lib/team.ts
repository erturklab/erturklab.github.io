import teamData from "@/content/team.json";
import type { TeamMemberLinks } from "@/components/ui/team-member-links";

export interface TimelineEntry {
  period: string;
  description: string;
}

export interface TeamMember {
  slug: string;
  title?: string;
  name: string;
  role: string;
  section: string;
  profileTier: "page" | "modal";
  /** Exact author strings as they appear on lab publications. */
  publicationAuthorNames?: string[];
  bio: string;
  biography?: string;
  researchInterests?: string;
  career?: TimelineEntry[];
  education?: TimelineEntry[];
  photo?: string;
  photoPosition?: string;
  links?: TeamMemberLinks;
}

export const teamMembers = teamData as TeamMember[];

export function getTeamMember(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug);
}

export function getPageTeamMembers(): TeamMember[] {
  return teamMembers.filter((m) => m.profileTier === "page");
}

export function formatFullName(member: Pick<TeamMember, "title" | "name">): string {
  return member.title ? `${member.title} ${member.name}` : member.name;
}

export function cardDisplayName(member: Pick<TeamMember, "name">): string {
  return member.name;
}
