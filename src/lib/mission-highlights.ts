/** Key phrases highlighted in mission / about copy across the site */
export const MISSION_HIGHLIGHT_TERMS = [
  "single-cell resolution",
  "enabling technologies",
  "artificial intelligence",
  "whole-body imaging",
  "nanotechnology",
] as const;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function splitTextWithHighlights(text: string, terms: readonly string[] = MISSION_HIGHLIGHT_TERMS) {
  const sorted = [...terms].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${sorted.map(escapeRegExp).join("|")})`, "gi");
  const lowerTerms = new Set(sorted.map((t) => t.toLowerCase()));

  return text.split(pattern).filter(Boolean).map((part) => ({
    text: part,
    highlight: lowerTerms.has(part.toLowerCase()),
  }));
}
