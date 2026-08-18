import Image from "next/image";
import Link from "next/link";
import type { TeamMember } from "@/lib/team";
import { cardDisplayName, displayInitials, formatFullName } from "@/lib/team";

function ProjectTeamAvatar({ member }: { member: TeamMember }) {
  if (!member.photo) {
    const initials = displayInitials(member.name);

    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)] text-sm font-semibold text-[var(--primary)] ring-1 ring-[var(--border)]">
        {initials}
      </div>
    );
  }

  return (
    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-[var(--border)]">
      <Image
        src={member.photo}
        alt={formatFullName(member)}
        fill
        className="object-cover"
        style={{ objectPosition: member.photoPosition ?? "center 20%" }}
        sizes="48px"
      />
    </div>
  );
}

export function ProjectTeamList({ members }: { members: TeamMember[] }) {
  if (members.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {members.map((member) => (
        <Link
          key={member.slug}
          href={`/team/${member.slug}`}
          className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)]/50 px-4 py-3 transition-colors hover:border-[var(--primary)]/35 hover:bg-[var(--card)]"
        >
          <ProjectTeamAvatar member={member} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold group-hover:text-[var(--primary)] transition-colors">
              {cardDisplayName(member)}
            </p>
            <p className="truncate text-xs text-[var(--muted-foreground)]">{member.role}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
