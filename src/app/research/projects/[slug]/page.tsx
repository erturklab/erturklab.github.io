import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";
import { PublicationAuthors } from "@/components/ui/publication-authors";
import { ProjectMediaGallery } from "@/components/ui/project-media-gallery";
import { ProjectTeamList } from "@/components/ui/project-team-list";
import { SectionLabel } from "@/components/ui/section-label";
import { ShowcaseImage } from "@/components/ui/showcase-image";
import {
  getProject,
  getProjects,
  getPublicationsForProject,
  getTeamMembersForProject,
  projectHref,
} from "@/lib/projects";
import { getRelatedProjects } from "@/lib/project-media";
import { ProjectPreviewCard } from "@/components/ui/project-preview-card";

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };

  return {
    title: project.name,
    description: project.headline,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const teamMembers = getTeamMembersForProject(slug);
  const publications = getPublicationsForProject(slug);
  const relatedProjects = getRelatedProjects(slug, 3);
  const hasMedia = Boolean(project.media && project.media.length > 0);

  return (
    <div className="pb-16 md:pb-24">
      <div className="mx-auto max-w-6xl px-4 pt-12 md:px-6 md:pt-16">
        <Link
          href="/research/projects"
          className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to projects
        </Link>

        <header className="mt-8 max-w-3xl">
          <SectionLabel>{project.journal}</SectionLabel>
          <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl lg:text-6xl">{project.name}</h1>
          <p className="mt-4 text-lg font-medium text-[var(--primary)] md:text-xl">{project.headline}</p>
        </header>
      </div>

      {hasMedia && project.media && (
        <div className="mx-auto mt-10 max-w-6xl px-4 md:px-6">
          <ProjectMediaGallery items={project.media} prominent />
        </div>
      )}

      <div className="mx-auto mt-12 max-w-6xl px-4 md:px-6">
        <div className={cnGrid(hasMedia)}>
          <div className="max-w-2xl">
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">{project.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium hover:border-[var(--primary)]/50 transition-colors"
                >
                  Read paper <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {project.atlas && (
                <a
                  href={project.atlas}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 px-4 py-2 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                >
                  Explore atlas <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
              {project.interactiveAtlas && (
                <a
                  href={project.interactiveAtlas}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium hover:border-[var(--primary)]/50 transition-colors"
                >
                  3D atlas <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {!hasMedia && (
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-[var(--border)]">
              <ShowcaseImage
                src={project.image}
                alt={project.headline}
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
              <p className="absolute bottom-3 left-4 text-[10px] text-[var(--foreground)]/70">{project.credit}</p>
            </div>
          )}
        </div>

        {teamMembers.length > 0 && (
          <section className="mt-16 border-t border-[var(--border)] pt-16">
            <SectionLabel>People</SectionLabel>
            <h2 className="font-display mt-3 text-2xl md:text-3xl">Lab contributors</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">
              Current Ertürk Lab members linked to this project.
            </p>
            <div className="mt-6">
              <ProjectTeamList members={teamMembers} />
            </div>
          </section>
        )}

        <section className="mt-16 border-t border-[var(--border)] pt-16">
          <SectionLabel>Publications</SectionLabel>
          <h2 className="font-display mt-3 text-2xl md:text-3xl">Related papers</h2>
          {publications.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">No linked publications yet.</p>
          ) : (
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {publications.map((pub) => (
                <article
                  key={`${pub.title}-${pub.year}`}
                  className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)]/60 p-6 transition-colors hover:border-[var(--primary)]/30 hover:bg-[var(--card)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span className="rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
                      {pub.journal}
                    </span>
                    <span className="text-sm tabular-nums text-[var(--muted-foreground)]">{pub.year}</span>
                  </div>
                  <h3 className="mt-4 text-base font-semibold leading-snug md:text-lg">
                    {pub.link ? (
                      <a
                        href={pub.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[var(--primary)] hover:underline underline-offset-4"
                      >
                        {pub.title}
                      </a>
                    ) : (
                      pub.title
                    )}
                  </h3>
                  <PublicationAuthors authors={pub.authors} className="mt-4" />
                  {pub.status && (
                    <p className="mt-auto pt-4 text-xs uppercase tracking-wide text-[var(--muted-foreground)]">
                      {pub.status}
                    </p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {relatedProjects.length > 0 && (
          <section className="mt-16 border-t border-[var(--border)] pt-16">
            <SectionLabel>More projects</SectionLabel>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {relatedProjects.map((item) => (
                <ProjectPreviewCard key={item.id} project={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function cnGrid(hasMedia: boolean) {
  return hasMedia ? "max-w-3xl" : "grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start";
}
