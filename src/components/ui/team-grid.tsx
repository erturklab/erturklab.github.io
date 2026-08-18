"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import Image from "next/image";
import { SectionLabel } from "./section-label";
import { TeamMemberLinksRow } from "./team-member-links";
import type { TeamMember } from "@/lib/team";
import { cardDisplayName, displayInitials, formatFullName } from "@/lib/team";

const sectionOrder = [
  "Group Leader",
  "Co-deputies & Leadership",
  "Operations & Administration",
  "Staff Scientists",
  "Technical Assistants",
  "Postdocs",
  "PhD Students",
  "Scientist",
  "Master Students",
] as const;

function TeamAvatar({
  src,
  alt,
  position = "center 20%",
  size = "card",
}: {
  src?: string;
  alt: string;
  position?: string;
  size?: "card" | "modal";
}) {
  const boxClass =
    size === "modal"
      ? "relative aspect-square w-full max-w-[280px] mx-auto sm:mx-0"
      : "relative aspect-square w-full";

  if (!src) {
    return (
      <div
        className={`${boxClass} flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)] text-xl font-semibold text-[var(--primary)] ring-1 ring-[var(--border)]`}
      >
        {displayInitials(alt)}
      </div>
    );
  }

  return (
    <div className={`${boxClass} overflow-hidden rounded-full ring-1 ring-[var(--border)] bg-[var(--secondary)]`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        style={{ objectPosition: position }}
        sizes={size === "modal" ? "280px" : "120px"}
      />
    </div>
  );
}

const cardClassName =
  "group flex w-full flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--card)]/50 px-5 py-6 text-center transition-colors hover:border-[var(--primary)]/35 hover:bg-[var(--card)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]";

function TeamCardContent({ member }: { member: TeamMember }) {
  return (
    <>
      <div className="mx-auto w-full max-w-[112px]">
        <TeamAvatar
          src={member.photo}
          alt={member.name}
          position={member.photoPosition ?? "center 20%"}
        />
      </div>
      <h2 className="mt-4 text-lg font-semibold leading-snug group-hover:text-[var(--primary)] transition-colors">
        {cardDisplayName(member)}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted-foreground)] leading-snug">{member.role}</p>
    </>
  );
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  const [active, setActive] = useState<TeamMember | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active]);

  const grouped = sectionOrder
    .map((section) => ({
      section,
      members: members.filter((m) => m.section === section),
    }))
    .filter((g) => g.members.length > 0);

  return (
    <>
      <div className="space-y-14">
        {grouped.map(({ section, members: groupMembers }) => (
          <section key={section}>
            <SectionLabel>{section}</SectionLabel>
            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {groupMembers.map((member) =>
                member.profileTier === "page" ? (
                  <Link key={member.slug} href={`/team/${member.slug}`} className={cardClassName}>
                    <TeamCardContent member={member} />
                  </Link>
                ) : (
                  <button
                    key={member.slug}
                    type="button"
                    onClick={() => setActive(member)}
                    className={cardClassName}
                  >
                    <TeamCardContent member={member} />
                  </button>
                )
              )}
            </div>
          </section>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal
          aria-labelledby="team-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[var(--background)]/85 backdrop-blur-md"
            onClick={() => setActive(null)}
            aria-label="Close profile"
          />
          <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-t-2xl sm:rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 z-20 rounded-full border border-[var(--border)] bg-[var(--background)]/90 p-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center px-6 pt-10 pb-8 sm:px-10 sm:pt-12">
              <TeamAvatar
                src={active.photo}
                alt={active.name}
                position={active.photoPosition ?? "center 20%"}
                size="modal"
              />
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-widest text-[var(--primary)]">
                {active.role}
              </p>
              <h2 id="team-modal-title" className="font-display mt-2 text-xl sm:text-2xl leading-tight text-center">
                {formatFullName(active)}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted-foreground)] text-center max-w-md">
                {active.biography ?? active.bio}
              </p>
              <TeamMemberLinksRow links={active.links} className="mt-6" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
