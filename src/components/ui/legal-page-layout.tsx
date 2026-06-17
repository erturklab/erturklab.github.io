import type { ReactNode } from "react";
import { ContentPageShell } from "./content-page-shell";
import { PageHero } from "./page-hero";

interface LegalPageLayoutProps {
  label: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function LegalPageLayout({ label, title, description, children }: LegalPageLayoutProps) {
  return (
    <>
      <PageHero narrow label={label} title={title} description={description} />
      <ContentPageShell>
        <article className="space-y-10 rounded-2xl border border-[var(--border)] bg-[var(--card)]/40 p-8 md:p-10">
          {children}
        </article>
      </ContentPageShell>
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl md:text-2xl text-[var(--foreground)]">{title}</h2>
      <div className="mt-4 space-y-3 text-base leading-relaxed text-[var(--muted-foreground)]">{children}</div>
    </section>
  );
}
