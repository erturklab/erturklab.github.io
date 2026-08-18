"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    _altmetric_embed_init?: () => void;
  }
}

/** Triggers Altmetric to process any .altmetric-embed elements in the DOM. */
export function AltmetricInit({ deps = [] as unknown[] }: { deps?: unknown[] } = {}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function init() {
      if (cancelled) return;
      if (typeof window._altmetric_embed_init === "function") {
        window._altmetric_embed_init();
      }
    }

    // Immediate + retries — covers soft navigation and late script load.
    init();
    for (const ms of [100, 300, 800, 1600, 3000]) {
      timers.push(setTimeout(init, ms));
    }

    const existing = document.querySelector(
      'script[src*="altmetric"], script[src*="embed.js"]'
    ) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", init);
    }

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      existing?.removeEventListener("load", init);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return null;
}

function hasLoadedBadge(host: HTMLElement): boolean {
  return Boolean(host.querySelector("img, svg, iframe, a[href*='altmetric']"));
}

/** Donut badge — renders only after Altmetric returns a real score, so empty papers leave no hole. */
export function AltmetricBadge({
  doi,
  size = "md",
  className,
}: {
  doi?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const box = size === "sm" ? 38 : 53;
  const scale = size === "sm" ? 0.59 : 0.82;

  useEffect(() => {
    if (!doi) return;
    const host = hostRef.current;
    if (!host) return;

    const update = () => setVisible(hasLoadedBadge(host));
    const observer = new MutationObserver(update);
    observer.observe(host, { childList: true, subtree: true, attributes: true });
    update();

    const timers = [150, 400, 1000, 2500, 5000].map((ms) => setTimeout(update, ms));
    if (typeof window._altmetric_embed_init === "function") {
      window._altmetric_embed_init();
    }

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [doi]);

  if (!doi) return null;

  return (
    <div
      className={visible ? className : undefined}
      style={visible ? { width: box, height: box } : { width: 0, height: 0, overflow: "hidden" }}
      aria-hidden={!visible}
    >
      <div
        ref={hostRef}
        className="altmetric-embed"
        data-badge-type="donut"
        data-doi={doi}
        data-condensed="true"
        data-hide-no-mentions="true"
        data-link-target="_blank"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: 64,
          height: 64,
          display: "block",
        }}
      />
    </div>
  );
}
