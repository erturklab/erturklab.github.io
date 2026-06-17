import type { Metadata } from "next";
import site from "@/content/site.json";
import { ScienceArtGallery } from "@/components/ui/science-art-gallery";

export const metadata: Metadata = { title: "Science Art" };
import { ScienceArtMedia, type ScienceArtMediaItem } from "@/components/ui/science-art-media";
import { VideoEmbed } from "@/components/ui/video-embed";
import { SectionLabel } from "@/components/ui/section-label";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const mediaItems = site.scienceArtMedia as ScienceArtMediaItem[];

export default function ScienceArtPage() {
  return (
    <>
      {/* Cinematic hero — full-bleed opening */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0">
          {mediaItems[0]?.youtubeId && (
            <VideoEmbed
              videoId={mediaItems[0].youtubeId}
              title="wildDISCO showcase"
              query="autoplay=0&rel=0&modestbranding=1&playsinline=1"
              ambient
              previewSrc="/images/showcase/whole-body-disco.jpg"
              previewAlt="wildDISCO whole-body imaging"
              className="pointer-events-none absolute inset-0 h-full w-full scale-110 opacity-40"
              iframeClassName="pointer-events-none"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-[var(--background)]/40" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 pt-32 md:px-6 md:pb-24">
          <SectionLabel>Science Art</SectionLabel>
          <h1 className="font-display mt-4 max-w-3xl text-4xl md:text-6xl leading-tight">
            Imaging that reveals{" "}
            <span className="italic text-[var(--primary)]">biology in three dimensions</span>
          </h1>
          <p className="mt-6 max-w-xl text-[var(--muted-foreground)]">
            Whole-body maps, cleared human organs, and vasculature at cellular resolution — from our DISCO pipelines and light-sheet microscopes.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <SectionLabel>Video showcase</SectionLabel>
        <p className="mt-2 max-w-2xl text-sm text-[var(--muted-foreground)]">
          Official video abstracts and interactive resources from our publications.
        </p>
        <div className="mt-10">
          <ScienceArtMedia items={mediaItems} />
        </div>
      </div>

      <section className="border-t border-[var(--border)] bg-[var(--card)]/20">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Gallery</SectionLabel>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">Click any image to enlarge.</p>
            </div>
            <Link href="/#wilddisco" className="inline-flex items-center gap-1 text-sm text-[var(--primary)] hover:gap-2 transition-all">
              Our technologies <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10">
            <ScienceArtGallery items={site.scienceArt} />
          </div>
        </div>
      </section>
    </>
  );
}
