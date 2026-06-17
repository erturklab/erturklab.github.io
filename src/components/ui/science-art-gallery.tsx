"use client";

import { useState } from "react";
import { ShowcaseImage } from "./showcase-image";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScienceArtItem {
  title: string;
  caption: string;
  image: string;
  credit: string;
}

export function ScienceArtGallery({ items }: { items: ScienceArtItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "group relative w-full overflow-hidden rounded-xl border border-[var(--border)] text-left",
              "aspect-[4/3]",
              i === 0 && "sm:col-span-2 lg:col-span-2 sm:aspect-[2/1]"
            )}
          >
            <ShowcaseImage
              src={item.image}
              alt={item.title}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.caption}
              </p>
            </div>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/95 p-4 backdrop-blur-md"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 z-10 rounded-full border border-[var(--border)] bg-[var(--card)] p-2"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="relative max-h-[90vh] max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)]">
              <ShowcaseImage
                src={items[active].image}
                alt={items[active].title}
                className="object-contain bg-black/60"
                sizes="90vw"
              />
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-2 px-1">
              <div>
                <p className="font-semibold">{items[active].title}</p>
                <p className="text-sm text-[var(--muted-foreground)]">{items[active].caption}</p>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">{items[active].credit}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
