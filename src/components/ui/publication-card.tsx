"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { getPublicationPreviewMedia } from "@/lib/project-media";
import { getProjectForPublication, publicationProjectHref } from "@/lib/projects";
import { LocalVideoPlayer } from "./local-video-player";
import { ShowcaseImage } from "./showcase-image";
import { PublicationAuthors } from "./publication-authors";
import { CARD_PREVIEW_PLAYBACK_RATE } from "@/lib/video";
import { cn } from "@/lib/utils";

interface PublicationCardProps {
  title: string;
  authors: string;
  journal: string;
  year: number;
  note?: string;
  image?: string;
  videoId?: string;
  link?: string;
  className?: string;
}

export function PublicationCard({
  title,
  authors,
  journal,
  year,
  note,
  image,
  link,
  className,
}: PublicationCardProps) {
  const [authorsExpanded, setAuthorsExpanded] = useState(false);
  const project = getProjectForPublication({ note, link });
  const preview = getPublicationPreviewMedia(note);
  const projectHrefValue = publicationProjectHref(note, link);
  const poster = preview?.poster ?? image;
  const showMedia = Boolean(preview || image);

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all duration-300",
        "hover:border-[var(--primary)]/50 hover:shadow-[0_0_40px_-12px] hover:shadow-[var(--primary)]/20",
        className
      )}
    >
      {showMedia && (
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden rounded-t-2xl bg-black">
          {preview ? (
            <LocalVideoPlayer
              src={preview.src}
              title={preview.title}
              poster={poster}
              ambient
              fill
              compact
              fit="contain"
              playbackRate={CARD_PREVIEW_PLAYBACK_RATE}
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            poster && (
              <ShowcaseImage
                src={poster}
                alt={title}
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            )
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent opacity-60" />
        </div>
      )}

      <div className="flex flex-col p-5 md:p-6">
        <div className="flex shrink-0 items-center justify-between gap-3">
          <span className="rounded-full border border-[var(--border)] bg-[var(--secondary)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">
            {journal}
          </span>
          <span className="shrink-0 text-sm tabular-nums text-[var(--muted-foreground)]">{year}</span>
        </div>

        <h3 className="mt-3 h-[4.75rem] shrink-0 text-sm font-semibold leading-snug md:h-[5.5rem] md:text-base">
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="line-clamp-4 text-left group-hover:text-[var(--primary)] hover:underline underline-offset-4"
            >
              {title}
            </a>
          ) : (
            <span className="line-clamp-4 text-left">{title}</span>
          )}
        </h3>

        <div
          className={cn(
            "mt-2 shrink-0",
            !authorsExpanded && "min-h-[3.75rem]"
          )}
        >
          <PublicationAuthors
            authors={authors}
            collapsedClassName="line-clamp-1"
            onExpandedChange={setAuthorsExpanded}
          />
        </div>

        <div className="mt-4 shrink-0 border-t border-[var(--border)] pt-4">
          {project?.name && (
            <p className="mb-2 truncate text-left text-[11px] font-medium text-[var(--muted-foreground)]">
              {project.name}
            </p>
          )}
          <div className="flex min-h-[1.25rem] items-center justify-between gap-3">
            {projectHrefValue ? (
              <Link
                href={projectHrefValue}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--primary)] hover:underline underline-offset-2"
              >
                Project page <ArrowUpRight className="h-3 w-3 shrink-0" />
              </Link>
            ) : (
              <span />
            )}
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:underline underline-offset-2"
              >
                View paper <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
