import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionLabel } from "./section-label";

interface HeroPillar {
  title: string;
  description: string;
}

interface HeroImmersiveProps {
  institute: string;
  tagline: string;
  taglineAccent: string;
  subtitle: string;
  pillars?: HeroPillar[];
}

export function HeroImmersive({
  institute,
  tagline,
  taglineAccent,
  subtitle,
  pillars = [],
}: HeroImmersiveProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)]">
      <div className="pointer-events-none absolute inset-0 hero-mesh opacity-45" aria-hidden />
      <div className="pointer-events-none absolute inset-0 cell-grid opacity-[0.35]" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--background)]/30 via-[var(--background)]/80 to-[var(--background)]"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-20 pb-12 md:px-6 md:pt-28 md:pb-14">
        <div className="w-full rounded-3xl border border-[var(--border)]/60 bg-[color-mix(in_srgb,var(--background)_88%,transparent)] p-8 shadow-xl backdrop-blur-sm md:p-12">
          <SectionLabel>{institute}</SectionLabel>
          <h1 className="font-display mt-5 text-[2.5rem] leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            {tagline}{" "}
            <span className="italic text-[var(--primary)]">{taglineAccent}</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed text-[var(--foreground)] md:text-lg">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3.5 text-sm font-medium text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/15 transition-transform hover:scale-[1.02]"
            >
              Explore research <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-7 py-3.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50"
            >
              Open positions
            </Link>
          </div>
        </div>

        {pillars.length > 0 && (
          <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3">
            {pillars.map((pillar, i) => (
              <article
                key={pillar.title}
                className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_55%,transparent)] p-5 backdrop-blur-sm transition-colors hover:border-[var(--primary)]/30 md:p-6"
              >
                <span className="text-[10px] font-semibold tabular-nums text-[var(--primary)]">
                  0{i + 1}
                </span>
                <h2 className="font-display mt-2 text-lg leading-snug text-[var(--foreground)] md:text-xl">
                  {pillar.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
                  {pillar.description}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
