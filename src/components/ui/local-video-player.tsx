"use client";

import { useEffect, useRef, useState } from "react";
import { AMBIENT_PLAYBACK_RATE, resolveVideoUrl, videoMimeType } from "@/lib/video";
import { cn } from "@/lib/utils";

function applyVideoSettings(video: HTMLVideoElement, playbackRate: number) {
  video.playbackRate = playbackRate;
  video.defaultPlaybackRate = playbackRate;
}

export function LocalVideoPlayer({
  src,
  title,
  poster,
  className,
  fill = false,
  compact = false,
  ambient = true,
  playbackRate = AMBIENT_PLAYBACK_RATE,
  fit = "contain",
}: {
  src: string;
  title: string;
  poster?: string;
  className?: string;
  fill?: boolean;
  compact?: boolean;
  ambient?: boolean;
  playbackRate?: number;
  fit?: "contain" | "cover";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || !ambient || reduceMotion) return;

    const syncVisibility = () => {
      const rect = node.getBoundingClientRect();
      setInView(rect.top < window.innerHeight + 120 && rect.bottom > -120);
    };

    syncVisibility();

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.15, rootMargin: "120px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ambient, reduceMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    applyVideoSettings(video, playbackRate);

    const onMeta = () => applyVideoSettings(video, playbackRate);
    video.addEventListener("loadedmetadata", onMeta);

    if (!ambient || reduceMotion) return;

    if (inView) void video.play().catch(() => {});
    else video.pause();

    return () => video.removeEventListener("loadedmetadata", onMeta);
  }, [inView, ambient, reduceMotion, src, playbackRate]);

  if (reduceMotion && poster) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden bg-black",
          fill && !compact ? "h-full min-h-[280px]" : fill ? "h-full w-full" : "aspect-video",
          className
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={poster} alt={title} className="h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden bg-black",
        fill && !compact ? "h-full min-h-[280px]" : fill ? "h-full w-full" : "aspect-video",
        className
      )}
    >
      <video
        ref={videoRef}
        playsInline
        muted
        loop
        autoPlay={ambient}
        preload={inView ? "auto" : "metadata"}
        aria-label={title}
        className={cn(
          "h-full w-full",
          fit === "contain" ? "object-contain" : "object-cover",
          fill && !compact && "min-h-[280px]"
        )}
      >
        <source src={resolveVideoUrl(src)} type={videoMimeType(src)} />
      </video>
      {ambient && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
          aria-hidden
        />
      )}
    </div>
  );
}
