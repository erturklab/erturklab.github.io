"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";
import { projectHref } from "@/lib/projects";
import { LocalVideoPlayer } from "./local-video-player";
import { ShowcaseImage } from "./showcase-image";
import { CARD_PREVIEW_PLAYBACK_RATE } from "@/lib/video";
import { cn } from "@/lib/utils";

export function ProjectPreviewCard({
  project,
  className,
  compact = false,
}: {
  project: Project;
  className?: string;
  compact?: boolean;
}) {
  const hero = project.media?.[0];

  return (
    <Link
      href={projectHref(project.id)}
      className={cn(
        "group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]/50 transition-all hover:-translate-y-0.5 hover:border-[var(--primary)]/35 hover:bg-[var(--card)] hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--border)] bg-black">
        {hero ? (
          <LocalVideoPlayer
            src={hero.src}
            title={hero.title}
            poster={project.image}
            ambient
            fill
            compact
            fit="cover"
            playbackRate={CARD_PREVIEW_PLAYBACK_RATE}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <ShowcaseImage
            src={project.image}
            alt={project.headline}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes={compact ? "240px" : "320px"}
          />
        )}
      </div>
      <div className={cn(compact ? "p-3" : "p-4")}>
        {!compact && (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)]">{project.journal}</p>
        )}
        <p
          className={cn(
            "font-semibold group-hover:text-[var(--primary)] transition-colors",
            compact ? "text-sm" : "text-sm"
          )}
        >
          {project.name}
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)] line-clamp-2">{project.headline}</p>
      </div>
    </Link>
  );
}
