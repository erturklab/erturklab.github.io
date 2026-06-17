import type { Metadata } from "next";
import site from "@/content/site.json";
import { teamMembers } from "@/lib/team";

export const metadata: Metadata = { title: "Team" };
import { ContentPageShell } from "@/components/ui/content-page-shell";
import { PageHero } from "@/components/ui/page-hero";
import { AlumniList, type AlumniEntry } from "@/components/ui/alumni-list";
import { SectionLabel } from "@/components/ui/section-label";
import { TeamGrid } from "@/components/ui/team-grid";

type SiteWithAlumni = typeof site & {
  alumniIntro?: string;
  alumni?: AlumniEntry[];
};

const { alumni = [], alumniIntro } = site as SiteWithAlumni;

export default function TeamPage() {
  return (
    <>
      <PageHero
        narrow
        label="Team"
        title="Our team"
        description="Meet the people behind our research — an interdisciplinary group at iBIO, Helmholtz Munich."
      />
      <ContentPageShell>
        <TeamGrid members={teamMembers} />
      </ContentPageShell>

      {alumni.length > 0 && (
        <section className="border-t border-[var(--border)] bg-[var(--card)]/30">
          <ContentPageShell>
            <SectionLabel>Alumni</SectionLabel>
            <AlumniList
              entries={alumni}
              intro={
                alumniIntro ??
                "The following people spent time in the Ertürk Lab at iBIO, Helmholtz Munich."
              }
            />
          </ContentPageShell>
        </section>
      )}
    </>
  );
}
