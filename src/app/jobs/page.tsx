import type { Metadata } from "next";
import { ContentPageShell } from "@/components/ui/content-page-shell";
import { PageHero } from "@/components/ui/page-hero";

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
        <div className="py-12 max-w-2xl">
          <p className="text-base text-[var(--muted-foreground)] leading-relaxed">
            We currently do not have open positions listed here. If you are interested in joining
            our lab as a PhD student, postdoc, or research scientist, please send your CV and a
            brief motivation letter directly to us.
          </p>

          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8">
            <h2 className="text-lg font-semibold">Get in touch</h2>
            <p className="mt-3 text-base text-[var(--muted-foreground)]">
              Send your application to{" "}
              <a
                href="mailto:ali.erturk@helmholtz-munich.de"
                className="text-[var(--primary)] hover:underline underline-offset-4"
              >
                ali.erturk@helmholtz-munich.de
              </a>
              . Include your CV, a list of publications (if applicable), and a short description
              of your research interests.
            </p>
          </div>

          <p className="mt-8 text-sm text-[var(--muted-foreground)]">
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
      </ContentPageShell>
    </>
  );
}
