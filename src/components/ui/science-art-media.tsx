import { ArrowUpRight, Play } from "lucide-react";
import { ShowcaseImage } from "./showcase-image";
import { VideoEmbed } from "./video-embed";

const VIDEO_PREVIEWS: Record<string, string> = {
  "w57BU40-BCo": "/images/showcase/whole-body-disco.jpg",
  "ZnkNw5a-gvs": "/images/showcase/deepmact-cell.jpg",
  "i1-upP0kq5o": "/images/showcase/transparent-human-brain.jpg",
};

export interface ScienceArtMediaItem {
  title: string;
  description: string;
  type: "video" | "link";
  youtubeId?: string;
  href?: string;
  thumbnail?: string;
}

export function ScienceArtMedia({ items }: { items: ScienceArtMediaItem[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => {
        if (item.type === "video" && item.youtubeId) {
          return (
            <article
              key={item.title}
              className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
            >
              <VideoEmbed
                videoId={item.youtubeId}
                title={item.title}
                previewSrc={VIDEO_PREVIEWS[item.youtubeId]}
                previewAlt={item.title}
              />
              <div className="p-5">
                <div className="flex items-center gap-2 text-[var(--primary)]">
                  <Play className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest">Video</span>
                </div>
                <h3 className="mt-2 font-semibold leading-snug">{item.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.description}</p>
              </div>
            </article>
          );
        }

        return (
          <a
            key={item.title}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-all hover:border-[var(--primary)]/40"
          >
            {item.thumbnail && (
              <div className="relative aspect-video overflow-hidden">
                <ShowcaseImage
                  src={item.thumbnail}
                  alt={item.title}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)]/80 to-transparent" />
              </div>
            )}
            <div className="p-5">
              <div className="flex items-center gap-2 text-[var(--primary)]">
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-widest">Interactive</span>
              </div>
              <h3 className="mt-2 font-semibold leading-snug group-hover:text-[var(--primary)] transition-colors">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">{item.description}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
