import type { Metadata } from "next";
import Link from "next/link";
import site from "@/content/site.json";
import { LegalPageLayout, LegalSection } from "@/components/ui/legal-page-layout";

export const metadata: Metadata = { title: "Imprint" };

const { lab } = site;

export default function ImprintPage() {
  return (
    <LegalPageLayout
      label="Legal"
      title="Imprint"
      description="Information pursuant to § 5 TMG and responsible contact details for this website."
    >
      <LegalSection title="Provider">
        <p>
          <strong className="text-[var(--foreground)]">{lab.name}</strong>
          <br />
          {lab.institute}
          <br />
          Helmholtz Zentrum München — German Research Center for Environmental Health (Helmholtz Munich)
          <br />
          {lab.address.street}
          <br />
          {lab.address.building && (
            <>
              {lab.address.building}
              <br />
            </>
          )}
          {lab.address.city}
          <br />
          {lab.address.country}
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Email:{" "}
          <a href={`mailto:${lab.email}`} className="text-[var(--primary)] hover:underline">
            {lab.email}
          </a>
        </p>
      </LegalSection>

      <LegalSection title="Represented by">
        <p>
          Prof. Dr. Ali Ertürk, Director of {lab.instituteShort}, Helmholtz Munich.
          <br />
          Supplementary legal details (VAT ID, supervisory authority, dispute resolution) will be published here once
          confirmed by lab administration.
        </p>
      </LegalSection>

      <LegalSection title="Related pages">
        <p>
          <Link href="/privacy" className="text-[var(--primary)] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
