/** Browser-friendly MIME for files served from /public/videos/ */
export function videoMimeType(src: string): string {
  const lower = src.toLowerCase();
  if (lower.endsWith(".m4v") || lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".mov")) return "video/mp4";
  if (lower.endsWith(".webm")) return "video/webm";
  return "video/mp4";
}

/**
 * Prepends the CDN base URL (NEXT_PUBLIC_VIDEO_CDN_BASE_URL) to local video
 * paths so videos are fetched from the external CDN rather than the GitHub
 * Pages origin where they are not stored.
 */
export function resolveVideoUrl(src: string): string {
  const base = process.env.NEXT_PUBLIC_VIDEO_CDN_BASE_URL;
  if (base && src.startsWith("/")) {
    return `${base.replace(/\/$/, "")}${src}`;
  }
  return src;
}

/** Slightly faster ambient loops — scientific movies are often slow turntables */
export const AMBIENT_PLAYBACK_RATE = 1.4;

/** Homepage technology carousel — supplementary movies are very slow */
export const CAROUSEL_PLAYBACK_RATE = 2;

/** Small preview loops on cards (More projects, publications, research grid) */
export const CARD_PREVIEW_PLAYBACK_RATE = 1.75;
