import type { Metadata } from "next";
import Link from "next/link";
import site from "@/content/site.json";
import { LegalPageLayout, LegalSection } from "@/components/ui/legal-page-layout";

export const metadata: Metadata = { title: "Privacy" };
import { GdprArt, GdprRegulationLink } from "@/components/ui/gdpr-ref";
import { ResetContentPreferences } from "@/components/privacy-preferences";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      label="Legal"
      title="Privacy Policy"
      description="How we handle personal data on this website and through job applications."
    >
      <LegalSection title="Overview">
        <p>
          This website is operated by {site.lab.name} at {site.lab.institute}, Helmholtz Munich. We process personal
          data in accordance with the <GdprRegulationLink /> (Regulation (EU) 2016/679) and applicable German data
          protection law. This notice follows the information requirements of <GdprArt article="13" />.
        </p>
      </LegalSection>

      <LegalSection title="Website use">
        <p>
          We store your chosen appearance theme and your consent choices for embedded third-party content (YouTube
          videos, Google Maps) locally in your browser (localStorage). This is strictly necessary to remember your
          preferences and does not use analytics or advertising cookies.
        </p>
      </LegalSection>

      <LegalSection title="Embedded third-party content">
        <p>
          Some pages offer optional embedded content from Google (YouTube videos and Google Maps). This content is{" "}
          <strong className="text-[var(--foreground)]">not loaded automatically</strong>. Only if you choose to play a
          video or show the map does your browser connect to Google servers, which may be located outside the European
          Union — a transfer described in <GdprArt article="49" />. Google may receive your IP address and technical
          browser data. For details, see{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] hover:underline"
          >
            Google&apos;s Privacy Policy
          </a>
          .
        </p>
        <p>
          You can withdraw this choice at any time via <ResetContentPreferences inline /> in the footer (this reloads
          the page and shows previews again).
        </p>
      </LegalSection>

      <LegalSection title="Job applications">
        <p>
          When you apply for a position, we collect the information you submit (name, email address, CV, and optional
          motivation letter). The legal basis is your consent (<GdprArt article="6" /> (1)(a)) and, where applicable,
          steps at your request before entering a contract ((b)). Data is processed and stored through our internal
          hiring system solely for evaluating your application and related recruitment communication for the role you
          applied for.
        </p>
        <p>
          We do not use application data for unrelated marketing. Access is limited to authorised lab administrators
          involved in the hiring process. Data may be retained for a limited period after the recruitment process
          ends, subject to legal retention requirements.
        </p>
        <p>
          Submitting an application requires your explicit consent on the application form. Without consent, your
          application cannot be processed (<GdprArt article="7" />).
        </p>
      </LegalSection>

      <LegalSection title="Withdraw consent & delete your data">
        <p>
          You may withdraw your application or exercise your rights of access (<GdprArt article="15" />), rectification (
          <GdprArt article="16" />), erasure (<GdprArt article="17" />), and objection (<GdprArt article="21" />), subject
          to legal retention requirements.
        </p>
        <p>
          To withdraw consent or request deletion of application data, email{" "}
          <a
            href={`mailto:${site.lab.email}?subject=Privacy%20request%20%E2%80%94%20job%20application`}
            className="text-[var(--primary)] hover:underline"
          >
            {site.lab.email}
          </a>{" "}
          with the subject line &ldquo;Privacy request — job application&rdquo; and include the position you applied
          for and the email address used in your application.
        </p>
        <p>
          To clear locally stored site preferences (theme, video/map consent), use{" "}
          <ResetContentPreferences inline /> in the footer or remove site data for this domain in your browser settings.
        </p>
      </LegalSection>

      <LegalSection title="Supervisory authority">
        <p>
          You have the right to lodge a complaint with a data protection supervisory authority (<GdprArt article="77" />
          ). For Helmholtz Munich, the Bavarian State Office for Data Protection Supervision (BayLDA) is a relevant
          contact:{" "}
          <a
            href="https://www.lda.bayern.de"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] hover:underline"
          >
            lda.bayern.de
          </a>
          .
        </p>
        <p>
          A German-language privacy notice (Datenschutzerklärung) will be published after review by the institute legal
          team.
        </p>
      </LegalSection>

      <LegalSection title="Related pages">
        <p>
          <Link href="/imprint" className="text-[var(--primary)] hover:underline">
            Imprint
          </Link>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
