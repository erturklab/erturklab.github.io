import type { ReactNode } from "react";
import Link from "next/link";

/** Small inline GDPR article link — keeps legal pages readable. */
export function GdprArt({ article }: { article: string }) {
  const slug = article.replace(/\(/g, "").replace(/\)/g, "").replace(/\s+/g, "-").toLowerCase();
  return (
    <a
      href={`https://gdpr-info.eu/art-${slug}-gdpr/`}
      target="_blank"
      rel="noopener noreferrer"
      className="whitespace-nowrap text-[0.92em] text-[var(--primary)]/75 hover:text-[var(--primary)] hover:underline"
    >
      Art.&nbsp;{article}&nbsp;GDPR
    </a>
  );
}

export function GdprRegulationLink({ children = "EU GDPR" }: { children?: ReactNode }) {
  return (
    <a
      href="https://eur-lex.europa.eu/eli/reg/2016/679/oj"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--primary)] hover:underline"
    >
      {children}
    </a>
  );
}

export function PrivacyPolicyLink() {
  return (
    <Link href="/privacy" className="text-[var(--primary)] hover:underline">
      Privacy Policy
    </Link>
  );
}
