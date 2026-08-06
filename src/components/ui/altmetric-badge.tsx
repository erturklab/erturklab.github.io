"use client";

import { useEffect } from "react";

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
