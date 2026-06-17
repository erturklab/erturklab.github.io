"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { THEME_OPTIONS, applyTheme, loadStoredTheme, saveTheme, type ThemeId } from "@/lib/themes";
import { Palette } from "lucide-react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyTheme(loadStoredTheme());
  }, []);

  return <>{children}</>;
}

export function ThemePicker({ compact }: { compact?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeId>("dark");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(loadStoredTheme());
  }, []);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function select(next: ThemeId) {
    setTheme(next);
    saveTheme(next);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className={cn(
          "inline-flex items-center justify-center rounded-full border transition-colors",
          compact ? "h-8 w-8" : "h-9 w-9",
          open
            ? "border-[var(--primary)] text-[var(--foreground)] bg-[var(--secondary)]"
            : "border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)]"
        )}
        aria-label="Choose theme"
        title="Choose theme"
      >
        <Palette className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Choose theme"
          className="absolute right-0 top-full z-50 mt-2 w-72 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-3 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-[10px] uppercase tracking-widest text-[var(--muted-foreground)] mb-2 px-1">Theme</p>
          <div className="grid grid-cols-2 gap-2">
            {THEME_OPTIONS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => select(t.id)}
                className={cn(
                  "rounded-xl border-2 p-2 text-left transition-all",
                  theme === t.id ? "border-[var(--primary)]" : "border-[var(--border)] hover:border-[var(--muted-foreground)]"
                )}
              >
                <div className="mb-1.5 flex h-6 items-center gap-1 rounded-md px-1.5" style={{ background: t.preview.bg }}>
                  <span className="h-2 w-2 rounded-full" style={{ background: t.preview.accent }} />
                  <span className="h-1 flex-1 rounded opacity-40" style={{ background: t.preview.fg }} />
                </div>
                <span className="text-[11px] font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
