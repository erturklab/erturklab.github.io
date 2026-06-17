"use client";

import { useState } from "react";
import { GalleryVideoPlayer } from "./gallery-video-player";
import { SectionLabel } from "./section-label";
import type { ProjectMediaItem } from "./technology-showcase";
import { cn } from "@/lib/utils";

export function ProjectMediaGallery({
  items,
  prominent = false,
}: {
  items: ProjectMediaItem[];
  poster?: string;
  prominent?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (items.length === 0) return null;

  const active = items[activeIndex] ?? items[0];

  return (
    <section
      className={cn(
        prominent &&
          "overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.55)]"
      )}
    >
      {/* Hidden preloader — buffers all videos so tab switches are instant */}
      <div aria-hidden className="sr-only">
        {items.map((item) => (
          <video key={item.src} src={item.src} preload="auto" muted playsInline />
        ))}
      </div>
      {!prominent && (
        <>
          <SectionLabel>3D imaging</SectionLabel>
          <h2 className="font-display mt-3 text-2xl md:text-3xl">Interactive visualizations</h2>
        </>
      )}

      <div className={cn(prominent ? "" : "mt-6")}>
        <div
          className={cn(
            "overflow-hidden bg-black",
            prominent ? "rounded-t-3xl" : "rounded-2xl border border-[var(--border)]"
          )}
        >
          <GalleryVideoPlayer
            src={active.src}
            title={active.title}
            className={cn(prominent && "min-h-[320px] md:min-h-[480px] lg:min-h-[560px]")}
            fill={prominent}
          />
        </div>

        <div className={cn(prominent ? "px-5 py-6 md:px-8 md:py-8" : "mt-4")}>
          {items.length > 1 && (
            <div
              className="flex flex-wrap gap-2"
              role="tablist"
              aria-label="Project videos"
            >
              {items.map((item, index) => {
                const selected = index === activeIndex;
                const tabLabel = item.label ?? item.title;
                return (
                  <button
                    key={item.src}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    title={item.title}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "max-w-[11rem] truncate rounded-xl border px-3.5 py-2 text-left text-xs font-medium transition-all duration-200 md:text-sm",
                      selected
                        ? "border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)] shadow-sm"
                        : "border-[var(--border)] bg-[var(--secondary)]/60 text-[var(--muted-foreground)] hover:border-[var(--primary)]/40 hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {tabLabel}
                  </button>
                );
              })}
            </div>
          )}

          <div className={cn(items.length > 1 && "mt-5")}>
            <h3 className="font-display text-xl md:text-2xl">{active.title}</h3>
            {active.description && (
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
                {active.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
