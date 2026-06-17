import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import site from "@/content/site.json";
import { SectionLabel } from "@/components/ui/section-label";
import { PublicationCard } from "@/components/ui/publication-card";
import { TechnologyCarousel } from "@/components/ui/technology-carousel";
import { HeroImmersive } from "@/components/ui/hero-immersive";
import { MissionCopy } from "@/components/ui/highlight-text";
import { getFeaturedPublications, getPublicationKey, getSitePublications } from "@/lib/publications";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = { title: "Home" };

const featuredPublications = getFeaturedPublications(getSitePublications());
const projects = getProjects();

export default function HomePage() {
  return (
    <>
      <HeroImmersive
        institute={`${site.lab.institute} · Helmholtz Munich`}
        tagline="Mapping biology"
        taglineAccent="in three dimensions"
        subtitle="Enabling technologies for whole-body biology and precision medicine — from transparent tissue to single-cell maps."
        pillars={site.heroFeatures}
      />

      <section className="page-section mx-auto max-w-6xl px-4 py-24 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <SectionLabel>Our mission</SectionLabel>
            <h2 className="font-display mt-4 text-3xl md:text-4xl leading-tight">
              {site.lab.missionHeadline}
            </h2>
          </div>
          <MissionCopy paragraphs={site.lab.missionParagraphs} />
        </div>
      </section>

      <section id="technologies" className="page-section pb-24 md:pb-32 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionLabel>Our technologies</SectionLabel>
          <h2 className="font-display mt-3 text-3xl md:text-5xl max-w-3xl leading-tight">
            Whole-body imaging platforms we built
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
            DISCO tissue clearing, light-sheet microscopy, and deep learning — integrated pipelines that render entire organisms transparent and map them at single-cell resolution.
          </p>
          <div className="mt-10 md:mt-14">
            <TechnologyCarousel items={projects} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--border)] pt-8">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50"
            >
              Research overview
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/research/projects"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50"
            >
              View all projects
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section border-t border-[var(--border)] bg-[var(--card)]/40">
        <div className="mx-auto max-w-6xl px-4 py-24 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Publications</SectionLabel>
              <h2 className="font-display mt-3 text-3xl md:text-4xl">Selected publications</h2>
              <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
                Recent flagship papers from the lab.
              </p>
            </div>
            <Link href="/publications" className="text-sm text-[var(--primary)] hover:underline">
              Explore all publications →
            </Link>
          </div>
          <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
            {featuredPublications.slice(0, 3).map(({ featured: _h, ...pub }) => (
              <PublicationCard key={getPublicationKey(pub)} {...pub} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-[var(--border)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:px-6 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-[var(--primary)] opacity-80" />
          <h2 className="font-display mt-6 text-3xl md:text-5xl">Join our team</h2>
          <p className="mx-auto mt-4 max-w-lg text-[var(--muted-foreground)]">
            Passionate researchers at the interface of imaging, AI, and medicine — apply through our live job portal.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-4 text-sm font-medium text-[var(--primary-foreground)] shadow-lg shadow-[var(--primary)]/15"
            >
              View open positions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
