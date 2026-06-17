import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";

export const metadata: Metadata = { title: "Projects" };
import { ProjectPreviewCard } from "@/components/ui/project-preview-card";
import { getProjects } from "@/lib/projects";

export default function ResearchProjectsPage() {
  const projects = getProjects();

  return (
    <>
      <PageHero
        label="Technology & Research · Projects"
        title="Lab platforms & technologies"
        description="Each project page lists related publications and the lab members who contributed."
      />
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <Link
          href="/research"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to research overview
        </Link>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectPreviewCard key={project.id} project={project} compact />
          ))}
        </div>
      </div>
    </>
  );
}
