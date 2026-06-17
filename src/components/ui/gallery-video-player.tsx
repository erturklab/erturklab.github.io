"use client";

import { useEffect, useRef, useState } from "react";
import { AMBIENT_PLAYBACK_RATE, resolveVideoUrl } from "@/lib/video";
import { cn } from "@/lib/utils";

function tuneVideo(el: HTMLVideoElement, rate: number) {
  el.playbackRate = rate;
  el.defaultPlaybackRate = rate;
}

export function GalleryVideoPlayer({
  src,
  title,
  className,
  fill = false,
  playbackRate = AMBIENT_PLAYBACK_RATE,
  fit = "contain",
}: {
  src: string;
  title: string;
  className?: string;
  fill?: boolean;
  playbackRate?: number;
  fit?: "contain" | "cover";
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);
  const resolvedSrc = resolveVideoUrl(src);
  const [slotA, setSlotA] = useState(resolvedSrc);
  const [slotB, setSlotB] = useState<string | null>(null);
  const [visible, setVisible] = useState<"a" | "b">("a");
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

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
  }, []);

  useEffect(() => {
    const currentSrc = visible === "a" ? slotA : slotB;
    if (resolvedSrc === currentSrc) return;

    if (visible === "a") setSlotB(resolvedSrc);
    else setSlotA(resolvedSrc);
  }, [resolvedSrc, visible, slotA, slotB]);

  useEffect(() => {
    const hiddenSlot = visible === "a" ? "b" : "a";
    const hiddenEl = hiddenSlot === "a" ? videoA.current : videoB.current;
    const visibleEl = visible === "a" ? videoA.current : videoB.current;
    const hiddenSrc = hiddenSlot === "a" ? slotA : slotB;
    if (!hiddenEl || hiddenSrc !== resolvedSrc) return;

    tuneVideo(hiddenEl, playbackRate);

    const swap = () => {
      tuneVideo(hiddenEl, playbackRate);
      void hiddenEl.play().catch(() => {});
      if (visibleEl) visibleEl.pause();
      setVisible(hiddenSlot);
    };

    if (hiddenEl.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      swap();
      return;
    }

    hiddenEl.addEventListener("canplay", swap, { once: true });
    return () => hiddenEl.removeEventListener("canplay", swap);
  }, [slotA, slotB, src, visible, playbackRate]);

  useEffect(() => {
    const playVisible = (slot: "a" | "b", el: HTMLVideoElement | null) => {
      if (!el) return;
      tuneVideo(el, playbackRate);
      if (inView && visible === slot) void el.play().catch(() => {});
      else el.pause();
    };

    playVisible("a", videoA.current);
    playVisible("b", videoB.current);
  }, [inView, visible, slotA, slotB, playbackRate]);

  const fitClass = fit === "cover" ? "object-cover object-center" : "object-contain object-center";

  const layerClass = (slot: "a" | "b") =>
    cn(
      "absolute inset-0 h-full w-full bg-black",
      fitClass,
      visible === slot ? "z-[1] opacity-100" : "z-0 opacity-0 invisible",
      fill && "min-h-0"
    );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden bg-black",
        !fill && "aspect-video",
        className
      )}
    >
      <video
        ref={videoA}
        src={slotA}
        playsInline
        muted
        loop
        autoPlay
        preload={inView ? "auto" : "metadata"}
        aria-label={visible === "a" ? title : undefined}
        aria-hidden={visible !== "a"}
        className={layerClass("a")}
        onLoadedMetadata={(e) => tuneVideo(e.currentTarget, playbackRate)}
      />
      {slotB && (
        <video
          ref={videoB}
          src={slotB}
          playsInline
          muted
          loop
          autoPlay
          preload={inView ? "auto" : "metadata"}
          aria-label={visible === "b" ? title : undefined}
          aria-hidden={visible !== "b"}
          className={layerClass("b")}
          onLoadedMetadata={(e) => tuneVideo(e.currentTarget, playbackRate)}
        />
      )}
      {fit === "cover" && (
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/40 via-transparent to-black/5"
          aria-hidden
        />
      )}
    </div>
  );
}
