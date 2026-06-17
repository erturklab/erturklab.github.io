"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  Brain,
  Dna,
  FlaskConical,
  Microscope,
  Scan,
  Sparkles,
  Target,
  type LucideIcon,
} from "lucide-react";
import { GalleryVideoPlayer } from "./gallery-video-player";
import { ShowcaseImage } from "./showcase-image";
import type { Technology } from "./technology-showcase";
import { projectHref } from "@/lib/projects";
import { CAROUSEL_PLAYBACK_RATE } from "@/lib/video";
import { cn } from "@/lib/utils";

const PROJECT_ICONS: Record<string, LucideIcon> = {
  mousemapper: Brain,
  "scp-nano": Dna,
  wilddisco: Scan,
  "disco-ms": Microscope,
  shanel: FlaskConical,
  vessap: Sparkles,
  deepmact: Target,
};

function projectVisualSrc(project: Technology): string | null {
  return project.media?.[0]?.src ?? null;
}

export function TechnologyCarousel({ items }: { items: Technology[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex] ?? items[0];
  if (!active) return null;

  const Icon = PROJECT_ICONS[active.id] ?? Microscope;
  const videoSrc = projectVisualSrc(active);

  return (
    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,16.5rem)_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:gap-x-10 lg:gap-y-4 xl:grid-cols-[minmax(0,17.5rem)_minmax(0,1fr)]">
      {/* Left — stretches to video row height; first/last items align with video top/bottom */}
      <div
        className="order-3 flex flex-col gap-0.5 md:gap-1 lg:order-none lg:col-start-1 lg:row-start-1 lg:h-full lg:min-h-0 lg:justify-between lg:gap-0"
        role="tablist"
        aria-label="Lab platforms"
      >
        {items.map((project, index) => {
          const selected = index === activeIndex;
          const ItemIcon = PROJECT_ICONS[project.id] ?? Microscope;
          return (
            <button
              key={project.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "w-full shrink-0 text-left transition-all duration-300 ease-out",
                selected
                  ? "rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 shadow-[0_6px_24px_-10px_rgba(0,0,0,0.1)] md:px-4 md:py-4"
                  : "rounded-lg px-2 py-2 hover:bg-[var(--secondary)]/35 md:px-3 md:py-2.5"
              )}
            >
              <div className="flex items-start gap-2.5">
                <ItemIcon
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 transition-colors",
                    selected ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block font-semibold leading-snug transition-colors",
                      selected ? "text-sm text-[var(--foreground)]" : "text-xs text-[var(--muted-foreground)] md:text-sm"
                    )}
                  >
                    {project.name}
                  </span>

                  {selected && (
                    <div className="mt-2">
                      {project.slogan && (
                        <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">{project.slogan}</p>
                      )}
                      <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted-foreground)]/90">{project.headline}</p>
                      <Link
                        href={projectHref(project.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3.5 inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--background)]/50 px-3 py-1.5 text-xs font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
                      >
                        Project page
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Video — row 1, col 2 (size unchanged) */}
      <div className="order-1 relative w-full min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-black shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] md:rounded-3xl lg:order-none lg:col-start-2 lg:row-start-1">
        <div className="relative aspect-video w-full max-w-full">
          {videoSrc ? (
            <GalleryVideoPlayer
              src={videoSrc}
              title={active.media?.[0]?.title ?? active.name}
              fill
              fit="contain"
              playbackRate={CAROUSEL_PLAYBACK_RATE}
              className="absolute inset-0 bg-black"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <ShowcaseImage
                src={active.image}
                alt={active.headline}
                className="max-h-full max-w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 720px"
                priority
              />
            </div>
          )}
          <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 backdrop-blur-md">
            <Icon className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span className="text-xs font-medium text-white">{active.name}</span>
          </div>
        </div>
      </div>

      {/* Pagination — row 2, under video only */}
      <div className="order-2 flex justify-center gap-2 lg:order-none lg:col-start-2 lg:row-start-2">
          {items.map((project, index) => (
            <button
              key={project.id}
              type="button"
              aria-label={`Show ${project.name}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === activeIndex
                  ? "w-8 bg-[var(--primary)]"
                  : "w-2 bg-[var(--muted-foreground)]/35 hover:bg-[var(--muted-foreground)]/60"
              )}
            />
          ))}
      </div>
    </div>
  );
}
