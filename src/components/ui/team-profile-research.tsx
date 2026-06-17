"use client";

import { useState } from "react";
import type { Project } from "@/lib/projects";
import type { Publication } from "@/lib/publications";
import { ProjectPreviewCard } from "./project-preview-card";
import { PublicationCatalog } from "./publication-catalog";
import { SectionLabel } from "./section-label";
import { cn } from "@/lib/utils";

type ResearchTab = "projects" | "publications";

function initialTab(hasProjects: boolean, hasPublications: boolean): ResearchTab {
  if (hasProjects) return "projects";
  if (hasPublications) return "publications";
  return "projects";
}

export function TeamProfileResearch({
  firstName,
  projects,
  featured,
  publications,
  preprints,
}: {
  firstName: string;
  projects: Project[];
  featured: Publication[];
  publications: Publication[];
  preprints: Publication[];
}) {
  const hasProjects = projects.length > 0;
  const hasPublications = featured.length + publications.length + preprints.length > 0;
  const [tab, setTab] = useState<ResearchTab>(() => initialTab(hasProjects, hasPublications));

  if (!hasProjects && !hasPublications) {
    return (
      <section className="mt-10">
        <SectionLabel>Research</SectionLabel>
        <p className="mt-5 text-sm text-[var(--muted-foreground)] md:text-base">
          No projects or publications listed yet.
        </p>
      </section>
    );
  }

  const showToggle = hasProjects && hasPublications;

  return (
    <section className="mt-10">
      <SectionLabel>Research</SectionLabel>

      {showToggle && (
        <div className="mt-5 flex flex-wrap gap-2 border-b border-[var(--border)] pb-4">
          <button
            type="button"
            onClick={() => setTab("projects")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === "projects"
                ? "bg-[var(--secondary)] text-[var(--primary)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/50 hover:text-[var(--foreground)]"
            )}
          >
            Projects
          </button>
          <button
            type="button"
            onClick={() => setTab("publications")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === "publications"
                ? "bg-[var(--secondary)] text-[var(--primary)]"
                : "text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/50 hover:text-[var(--foreground)]"
            )}
          >
            Publications
          </button>
        </div>
      )}

      <div className={showToggle ? "mt-6" : "mt-5"}>
        {(tab === "projects" || !hasPublications) && hasProjects && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectPreviewCard key={project.id} project={project} compact />
            ))}
          </div>
        )}

        {(tab === "publications" || !hasProjects) && hasPublications && (
          <PublicationCatalog
            featured={featured}
            publications={publications}
            preprints={preprints}
            hideEmptyTabs
            featuredDescription={`Lab flagship papers and other peer-reviewed work featuring ${firstName}.`}
          />
        )}
      </div>
    </section>
  );
}
