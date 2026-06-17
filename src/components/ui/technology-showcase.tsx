import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { SectionLabel } from "./section-label";
import { ShowcaseImage } from "./showcase-image";
import { LocalVideoPlayer } from "./local-video-player";
import { projectHref } from "@/lib/projects";
import { cn } from "@/lib/utils";

export interface ProjectMediaItem {
  src: string;
  title: string;
  label?: string;
  description?: string;
}

export interface Technology {
  id: string;
  name: string;
  slogan?: string;
  headline: string;
  description: string;
  journal: string;
  image: string;
  credit: string;
  link?: string;
  atlas?: string;
  interactiveAtlas?: string;
  media?: ProjectMediaItem[];
}

export function TechnologyShowcase({ items }: { items: Technology[] }) {
  return (
    <div className="space-y-8">
      {items.map((tech, i) => {
        const imageRight = i % 2 === 1;
        const heroVideo = tech.media?.[0];
        return (
          <section
            key={tech.id}
            id={tech.id}
            className="scroll-mt-24 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] grid lg:grid-cols-2 transition-shadow duration-500 hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--primary)_25%,transparent),0_24px_48px_-24px_rgba(0,0,0,0.45)]"
            style={{ animation: "section-enter 0.7s ease both", animationDelay: `${i * 0.08}s` }}
          >
            <div
              className={cn(
                "relative min-h-[280px] lg:min-h-[400px] overflow-hidden bg-black",
                imageRight ? "lg:order-2" : "lg:order-1"
              )}
            >
              {heroVideo ? (
                <LocalVideoPlayer
                  src={heroVideo.src}
                  title={heroVideo.title}
                  poster={tech.image}
                  fill
                  className="absolute inset-0 h-full min-h-[280px] rounded-none border-0 lg:min-h-[400px]"
                />
              ) : (
                <>
                  <ShowcaseImage
                    src={tech.image}
                    alt={tech.headline}
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 576px"
                    priority={i < 2}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[var(--background)]/20" />
                </>
              )}
              <p className="absolute bottom-3 left-4 z-10 text-[10px] text-[var(--foreground)]/70 mix-blend-difference">{tech.credit}</p>
            </div>

            <div
              className={cn(
                "flex flex-col justify-center px-6 py-10 md:px-10 md:py-12",
                imageRight ? "lg:order-1" : "lg:order-2"
              )}
            >
              <SectionLabel>{tech.journal}</SectionLabel>
              <h3 className="font-display mt-3 text-2xl md:text-3xl leading-tight">{tech.name}</h3>
              <p className="mt-2 text-base font-medium text-[var(--primary)]">{tech.headline}</p>
              <p className="mt-4 text-sm md:text-base text-[var(--muted-foreground)] leading-relaxed max-w-lg">
                {tech.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={projectHref(tech.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 px-4 py-2 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                >
                  Project page <ArrowUpRight className="h-3 w-3" />
                </Link>
                {tech.link && (
                  <a
                    href={tech.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-4 py-2 text-xs font-medium hover:border-[var(--primary)]/50 transition-colors"
                  >
                    Read paper <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {tech.atlas && (
                  <a
                    href={tech.atlas}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/10 px-4 py-2 text-xs font-medium text-[var(--primary)] hover:bg-[var(--primary)]/20 transition-colors"
                  >
                    Explore atlas <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
                <Link
                  href="/science-art"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  More imaging <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
