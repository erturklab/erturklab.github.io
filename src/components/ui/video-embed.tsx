"use client";

import { Maximize2 } from "lucide-react";
import { useCallback, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { ExternalContentGate } from "./external-content-gate";

const IFRAME_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";

interface VideoEmbedProps {
  videoId: string;
  title: string;
  query?: string;
  className?: string;
  iframeClassName?: string;
  /** Decorative background — skip Firefox control separation */
  ambient?: boolean;
  /** Local image shown before YouTube consent (no Google request) */
  previewSrc?: string;
  previewAlt?: string;
}

function buildEmbedQuery(query: string, ambient: boolean) {
  const params = new URLSearchParams(query);
  if (!ambient) {
    // Hide YouTube's bottom-right fullscreen — we render our own below the iframe.
    params.set("fs", "0");
  }
  return params.toString();
}

export function VideoEmbed({
  videoId,
  title,
  query = "rel=0&modestbranding=1&playsinline=1",
  className,
  iframeClassName,
  ambient = false,
  previewSrc,
  previewAlt,
}: VideoEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const embedQuery = useMemo(() => buildEmbedQuery(query, ambient), [query, ambient]);

  const enterFullscreen = useCallback(() => {
    iframeRef.current?.requestFullscreen?.().catch(() => {});
  }, []);

  const player = (
    <div className={cn("video-embed bg-black", ambient && "video-embed--ambient", className)}>
      <div className="video-embed__shell">
        <div className="video-embed__player">
          <iframe
            ref={iframeRef}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?${embedQuery}`}
            title={title}
            allow={IFRAME_ALLOW}
            allowFullScreen
            className={cn("video-embed__iframe", iframeClassName)}
          />
          {!ambient && (
            <button
              type="button"
              className="video-embed__fs-btn"
              onClick={enterFullscreen}
              aria-label="Full screen"
            >
              <Maximize2 aria-hidden className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <ExternalContentGate
      provider="youtube"
      fill={ambient}
      className={ambient ? className : undefined}
      previewSrc={previewSrc}
      previewAlt={previewAlt ?? title}
      previewLabel={title}
    >
      {player}
    </ExternalContentGate>
  );
}
