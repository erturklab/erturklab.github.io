"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { CONSENT_KEYS, readConsent, shouldPersistConsent, writeConsent } from "@/lib/consent-storage";

/** Slim first-visit notice — essential storage only; not a tracking cookie banner. */
export function SiteNotice() {
  const [visible, setVisible] = useState(!shouldPersistConsent());

  useEffect(() => {
    if (!shouldPersistConsent()) {
      setVisible(true);
      return;
    }
    setVisible(!readConsent(CONSENT_KEYS.siteNotice));
  }, []);

  function dismiss() {
    writeConsent(CONSENT_KEYS.siteNotice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Privacy notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_92%,transparent)] p-4 shadow-[0_-8px_40px_-12px] shadow-black/40 backdrop-blur-md md:p-5"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-6">
        <p className="max-w-3xl text-xs leading-relaxed text-[var(--muted-foreground)] md:text-sm">
          We use essential browser storage for your theme preference. Videos and maps from Google load{" "}
          <strong className="font-medium text-[var(--foreground)]">only after you choose to play or show them</strong>.
          No analytics or ad cookies.{" "}
          <Link href="/privacy" className="text-[var(--primary)] hover:underline">
            Privacy Policy
          </Link>
          {!shouldPersistConsent() && (
            <span className="mt-1 block text-[10px] text-[var(--muted-foreground)]/70">
              Dev mode: this notice reappears on every refresh.
            </span>
          )}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full bg-[var(--primary)] px-5 py-2 text-xs font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 md:text-sm"
          >
            Understood
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="rounded-full p-2 text-[var(--muted-foreground)] hover:bg-[var(--card)] hover:text-[var(--foreground)]"
            aria-label="Close notice"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
