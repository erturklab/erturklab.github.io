"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { MapPin, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONSENT_KEYS, readConsent, writeConsent } from "@/lib/consent-storage";
import { GdprArt } from "./gdpr-ref";

export type ExternalProvider = "youtube" | "google-maps";

const PROVIDER_COPY: Record<ExternalProvider, { button: string; vendor: string }> = {
  youtube: { button: "Play video", vendor: "YouTube / Google" },
  "google-maps": { button: "Show map", vendor: "Google Maps" },
};

interface ExternalContentGateProps {
  provider: ExternalProvider;
  className?: string;
  fill?: boolean;
  /** Local preview image — no third-party request before consent */
  previewSrc?: string;
  previewAlt?: string;
  previewLabel?: string;
  children: React.ReactNode;
}

export function ExternalContentGate({
  provider,
  className,
  fill,
  previewSrc,
  previewAlt = "",
  previewLabel,
  children,
}: ExternalContentGateProps) {
  const storageKey = provider === "youtube" ? CONSENT_KEYS.youtube : CONSENT_KEYS.googleMaps;
  const [consented, setConsented] = useState(false);

  useLayoutEffect(() => {
    if (readConsent(storageKey)) {
      setConsented(true);
    }
  }, [storageKey]);

  function accept() {
    writeConsent(storageKey);
    setConsented(true);
  }

  if (consented) {
    return <>{children}</>;
  }

  const copy = PROVIDER_COPY[provider];
  const isMap = provider === "google-maps";

  return (
    <div
      className={cn(
        "group relative overflow-hidden bg-black",
        fill ? "absolute inset-0" : "aspect-video w-full",
        className
      )}
    >
      {previewSrc ? (
        <Image
          src={previewSrc}
          alt={previewAlt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          sizes={fill ? "100vw" : "(max-width: 768px) 100vw, 50vw"}
        />
      ) : isMap ? (
        <div
          className="absolute inset-0 bg-[color-mix(in_srgb,var(--card)_90%,var(--muted-foreground)_10%)]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--border) 40%, transparent) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--card)] via-[var(--background)] to-black" aria-hidden />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/90 via-[var(--background)]/45 to-[var(--background)]/25" />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 py-8 text-center">
        <button
          type="button"
          onClick={accept}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white shadow-[0_0_40px_-8px] shadow-[var(--primary)]/30 backdrop-blur-sm transition-all hover:scale-105 hover:border-[var(--primary)]/50 hover:bg-black/55"
          aria-label={copy.button}
        >
          {isMap ? <MapPin className="h-7 w-7 text-[var(--primary)]" aria-hidden /> : <Play className="ml-1 h-7 w-7 fill-white text-white" aria-hidden />}
        </button>

        {previewLabel && (
          <p className="max-w-sm text-sm font-medium leading-snug text-[var(--foreground)] drop-shadow-sm">{previewLabel}</p>
        )}

        <p className="max-w-xs text-[11px] leading-relaxed text-[var(--muted-foreground)]">
          {copy.vendor} · EU servers not guaranteed ·{" "}
          <Link href="/privacy" className="text-[var(--primary)]/80 hover:text-[var(--primary)] hover:underline">
            Privacy
          </Link>
        </p>

        <button
          type="button"
          onClick={accept}
          className="rounded-full border border-[var(--border)] bg-[var(--background)]/80 px-4 py-1.5 text-xs font-medium text-[var(--foreground)] backdrop-blur-sm transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
        >
          {copy.button}
        </button>

        <p className="text-[10px] text-[var(--muted-foreground)]/80">
          <GdprArt article="49" /> · third-country transfer
        </p>
      </div>
    </div>
  );
}
