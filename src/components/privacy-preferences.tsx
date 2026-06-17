"use client";

import { clearExternalContentConsent } from "@/lib/consent-storage";
import { cn } from "@/lib/utils";

export function ResetContentPreferences({ inline, utility }: { inline?: boolean; utility?: boolean }) {
  return (
    <button
      type="button"
      onClick={clearExternalContentConsent}
      className={cn(
        inline
          ? "inline text-[var(--primary)] hover:underline"
          : utility
            ? "text-left text-xs text-[var(--muted-foreground)]/80 transition-colors hover:text-[var(--primary)]"
            : "text-left text-sm text-[var(--muted-foreground)] transition-colors hover:text-[var(--primary)]"
      )}
    >
      Reset video &amp; map preferences
    </button>
  );
}
