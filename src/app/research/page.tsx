import type { Metadata } from "next";
import { BookOpen, Layers } from "lucide-react";

export const metadata: Metadata = { title: "Research" };
import site from "@/content/site.json";
import { PageHero } from "@/components/ui/page-hero";
import { HighlightText } from "@/components/ui/highlight-text";
import { PillarCard } from "@/components/ui/pillar-card";
import { SectionLabel } from "@/components/ui/section-label";

export default function ResearchPage() {
  return (
    <>
      <PageHero
        label="Technology & Research · Overview"
        title="Enabling technologies for whole-body biology"
        description={
          <HighlightText text={site.lab.mission} as="span" className="block" />
        }
      />
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <div className="space-y-20">
          {site.researchPillars.map((pillar, i) => (
            <section key={pillar.id} id={pillar.id} className="scroll-mt-28 grid gap-8 lg:grid-cols-[auto_1fr]">
              <span className="font-display text-5xl text-[var(--primary)]/30 tabular-nums">0{i + 1}</span>
              <div>
                <SectionLabel>{pillar.title}</SectionLabel>
                <h2 className="font-display mt-2 text-3xl md:text-4xl">{pillar.title}</h2>
                <p className="mt-5 max-w-3xl text-[var(--muted-foreground)] leading-relaxed">{pillar.summary}</p>
                <ul className="mt-8 space-y-4">
                  {pillar.highlights.map((h) => (
                    <li key={h} className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)]" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-20">
          <SectionLabel>Explore</SectionLabel>
          <h2 className="font-display mt-3 text-2xl md:text-3xl">Projects & publications</h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
            Browse lab platforms and the peer-reviewed papers behind them.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <PillarCard
              title="Projects"
              summary="Lab platforms — tissue clearing, light-sheet imaging, spatial omics, and AI pipelines for whole-body biology."
              href="/research/projects"
              icon={Layers}
            />
            <PillarCard
              title="Publications"
              summary="Peer-reviewed papers and preprints — flagship work, full catalogs, and lab preprints."
              href="/publications"
              icon={BookOpen}
            />
          </div>
        </div>
      </div>
    </>
  );
}
