import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ContentPageShell } from "./content-page-shell";
import type { TeamMember } from "@/lib/team";
import { formatFullName } from "@/lib/team";
import { getProjectsForTeamMember, getPublicationCatalogForTeamMember } from "@/lib/projects";
import { TeamProfileResearch } from "./team-profile-research";
import { TeamMemberLinksRow, TeamContactInformation } from "./team-member-links";
import { SectionLabel } from "./section-label";

function TimelineSection({ title, entries }: { title: string; entries: { period: string; description: string }[] }) {
  if (!entries.length) return null;

  return (
    <section className="mt-10">
      <SectionLabel>{title}</SectionLabel>
      <ul className="mt-5 space-y-4">
        {entries.map((entry) => (
          <li key={`${entry.period}-${entry.description.slice(0, 24)}`} className="flex flex-col gap-1 sm:flex-row sm:gap-6">
            <span className="shrink-0 text-sm font-semibold uppercase tracking-wide text-[var(--primary)] sm:w-36">
              {entry.period}
            </span>
            <span className="text-base leading-relaxed text-[var(--muted-foreground)]">{entry.description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProfileAvatar({ member }: { member: TeamMember }) {
  const alt = formatFullName(member);

  if (!member.photo) {
    const initials = member.name
      .split(" ")
      .filter((p) => p.length > 1)
      .slice(0, 2)
      .map((p) => p[0])
      .join("");

    return (
      <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)] ring-1 ring-[var(--border)] sm:mx-0">
        <div className="flex h-full items-center justify-center text-3xl font-semibold text-[var(--primary)]">{initials}</div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-full ring-1 ring-[var(--border)] bg-[var(--secondary)] sm:mx-0">
      <Image
        src={member.photo}
        alt={alt}
        fill
        className="object-cover"
        style={{ objectPosition: member.photoPosition ?? "center 20%" }}
        sizes="280px"
        priority
      />
    </div>
  );
}

export function TeamProfile({ member }: { member: TeamMember }) {
  const biography = member.biography ?? member.bio;
  const projects = getProjectsForTeamMember(member.slug);
  const { featured, publications, preprints } = getPublicationCatalogForTeamMember(member.slug);
  const firstName = member.name.split(" ")[0];

  return (
    <ContentPageShell className="py-12 md:py-16">
      <Link
        href="/team"
        className="inline-flex items-center gap-2 text-base text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to team
      </Link>

      <div className="mt-10 flex flex-col gap-10 sm:flex-row sm:items-start">
        <ProfileAvatar member={member} />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--primary)]">{member.role}</p>
          <h1 className="font-display mt-2 text-3xl leading-tight md:text-4xl">{formatFullName(member)}</h1>
          <p className="mt-1 text-base text-[var(--muted-foreground)]">{member.section}</p>
          <TeamMemberLinksRow links={member.links} className="mt-6 justify-center sm:justify-start" />
        </div>
      </div>

      <section className="mt-12">
        <SectionLabel>Biography</SectionLabel>
        <div className="mt-5 space-y-4 text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">
          {biography.split(/\n\n+/).map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph.trim()}</p>
          ))}
        </div>
      </section>

      {member.researchInterests && (
        <section className="mt-10">
          <SectionLabel>Research interests</SectionLabel>
          <p className="mt-5 text-base leading-relaxed text-[var(--muted-foreground)] md:text-lg">{member.researchInterests}</p>
        </section>
      )}

      {member.career && <TimelineSection title="Professional career" entries={member.career} />}
      {member.education && <TimelineSection title="Education" entries={member.education} />}

      <TeamProfileResearch
        firstName={firstName}
        projects={projects}
        featured={featured}
        publications={publications}
        preprints={preprints}
      />

      <TeamContactInformation links={member.links} />
    </ContentPageShell>
  );
}
