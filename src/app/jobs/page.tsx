import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { ContentPageShell } from "@/components/ui/content-page-shell";
import { PageHero } from "@/components/ui/page-hero";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata: Metadata = { title: "Jobs" };

export default function JobsPage() {
  return (
    <>
      <PageHero
        narrow
        label="Careers"
        title="Open positions"
        description="We are always looking for motivated scientists to join the Ertürk Lab."
      />

      <ContentPageShell>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel>Applications</SectionLabel>
            <div className="mt-8 space-y-6">
              <p className="text-base text-[var(--muted-foreground)] leading-relaxed">
                Open positions are announced on Prof. Ertürk&apos;s LinkedIn. Follow him to stay
                up to date, and mention the <strong>Job ID</strong> from the LinkedIn post in your email.
              </p>
              <a
                href="https://www.linkedin.com/in/ali-maximilian-ert%C3%BCrk/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-4 py-2 text-sm font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary)]/20"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Follow Prof. Ertürk on LinkedIn
              </a>
              <div>
                <p className="text-base font-medium">Contact for applications</p>
                <a
                  href="mailto:ali.erturk@helmholtz-munich.de"
                  className="mt-2 inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  ali.erturk@helmholtz-munich.de
                </a>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>What to include</SectionLabel>
            <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
              {[
                { label: "CV", detail: "Full curriculum vitae" },
                { label: "Publications", detail: "List of publications, if applicable" },
                { label: "Research interests", detail: "Short description of what you want to work on" },
                { label: "References", detail: "Contact details of 2–3 referees" },
              ].map(({ label, detail }) => (
                <div key={label} className="flex gap-3">
                  <span className="mt-0.5 text-[var(--primary)] font-bold">→</span>
                  <div>
                    <p className="text-base font-medium">{label}</p>
                    <p className="text-sm text-[var(--muted-foreground)]">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-[var(--muted-foreground)]">
              For more information about life at the institute, visit the{" "}
              <a
                href="https://www.helmholtz-munich.de"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary)] hover:underline underline-offset-4"
              >
                Helmholtz Munich website
              </a>
              .
            </p>
          </div>
        </div>
      </ContentPageShell>
    </>
  );
}
