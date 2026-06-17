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
                We currently do not have open positions listed here. If you are interested in
                joining our lab as a PhD student, postdoc, or research scientist, please send
                your CV and a brief motivation letter directly to us.
              </p>
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
