"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { extractDoi } from "@/lib/publications";
import { getPublicationPreviewMedia } from "@/lib/project-media";
import { getProjectForPublication, publicationProjectHref } from "@/lib/projects";
import { LocalVideoPlayer } from "./local-video-player";
import { ShowcaseImage } from "./showcase-image";
import { PublicationAuthors } from "./publication-authors";
import { CARD_PREVIEW_PLAYBACK_RATE } from "@/lib/video";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    _altmetric_embed_init?: () => void;
  }
}

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
  const doi = extractDoi(link);
  const poster = preview?.poster ?? image;
  const showMedia = Boolean(preview || image);

  // Re-init Altmetric after client navigation (home / featured cards).
  useEffect(() => {
    if (!doi) return;
    const run = () => {
      if (typeof window._altmetric_embed_init === "function") {
        window._altmetric_embed_init();
      }
    };
    run();
    const t1 = setTimeout(run, 200);
    const t2 = setTimeout(run, 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [doi]);

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all duration-300",
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

      <div className="flex flex-1 flex-col p-5 md:p-6">
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

        {/* Project name reserve: fixed min-height so the border-t is always at the same height
             across all cards in the same row, regardless of whether a name exists. */}
        <div className="mt-auto">
          <div className="min-h-[1.375rem]">
            {project?.name && (
              <p className="truncate text-left text-[11px] font-medium text-[var(--muted-foreground)]">
                {project.name}
              </p>
            )}
          </div>
          <div className="shrink-0 border-t border-[var(--border)] pt-4">
            {/* Always 3-col grid so the badge stays geometrically centered */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="justify-self-start">
                {projectHrefValue ? (
                  <Link
                    href={projectHrefValue}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--primary)] hover:underline underline-offset-2"
                  >
                    Project page <ArrowUpRight className="h-3 w-3 shrink-0" />
                  </Link>
                ) : doi ? (
                  /* No project page → badge on the left */
                  <div style={{ width: 38, height: 38 }}>
                    <div
                      className="altmetric-embed"
                      data-badge-type="donut"
                      data-doi={doi}
                      data-condensed="true"
                      data-hide-no-mentions="true"
                      data-link-target="_blank"
                      style={{ transform: "scale(0.59)", transformOrigin: "top left", width: 64, height: 64, display: "block" }}
                    />
                  </div>
                ) : null}
              </div>
              <div>
                {/* Center badge only when project page also exists */}
                {projectHrefValue && doi ? (
                  <div style={{ width: 38, height: 38 }}>
                    <div
                      className="altmetric-embed"
                      data-badge-type="donut"
                      data-doi={doi}
                      data-condensed="true"
                      data-hide-no-mentions="true"
                      data-link-target="_blank"
                      style={{ transform: "scale(0.59)", transformOrigin: "top left", width: 64, height: 64, display: "block" }}
                    />
                  </div>
                ) : null}
              </div>
              <div className="justify-self-end">
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:underline underline-offset-2"
                  >
                    View paper <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
