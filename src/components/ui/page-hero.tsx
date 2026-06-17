import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "./section-label";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  label: string;
  title: string;
  description?: ReactNode;
  cta?: { href: string; label: string };
  large?: boolean;
  narrow?: boolean;
  className?: string;
}

export function PageHero({ label, title, description, cta, large, narrow, className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-[var(--border)]",
        large ? "min-h-[72vh] flex items-end" : "py-16 md:py-20",
        className
      )}
    >
      {/* Decorative backgrounds only — never mask text content */}
      <div className="pointer-events-none absolute inset-0 hero-mesh" aria-hidden />
      <div className="pointer-events-none absolute inset-0 cell-grid" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--background)]/40 via-transparent to-[var(--background)]/90"
        aria-hidden
      />

      <div
        className={cn(
          "relative mx-auto max-w-6xl px-4 md:px-6 w-full",
          large ? "pb-16 pt-28 md:pb-24 md:pt-32" : ""
        )}
      >
        <div className="w-full rounded-2xl border border-[var(--border)]/50 bg-[color-mix(in_srgb,var(--background)_78%,transparent)] p-6 shadow-sm backdrop-blur-sm md:p-8">
          <SectionLabel>{label}</SectionLabel>
          <h1
            className={cn(
              "font-display mt-4 leading-[1.05] tracking-tight text-[var(--foreground)]",
              large ? "text-5xl md:text-7xl lg:text-[5.25rem]" : "text-4xl md:text-5xl"
            )}
          >
            {title}
          </h1>
          {description && (
            typeof description === "string" ? (
              <p className="mt-6 text-base md:text-lg text-[var(--foreground)]/85 leading-relaxed">
                {description}
              </p>
            ) : (
              <div className="mt-6 text-base md:text-lg text-[var(--foreground)]/85 leading-relaxed">
                {description}
              </div>
            )
          )}
          {cta && (
            <Link
              href={cta.href}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-medium text-[var(--primary-foreground)] transition-transform hover:scale-[1.02]"
            >
              {cta.label} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
