import type { Metadata } from "next";
import Link from "next/link";
import site from "@/content/site.json";
import { ContentPageShell } from "@/components/ui/content-page-shell";

export const metadata: Metadata = { title: "Contact" };
import { PageHero } from "@/components/ui/page-hero";
import { SectionLabel } from "@/components/ui/section-label";
import { SocialLinks } from "@/components/ui/social-links";
import { GoogleMapsEmbed } from "@/components/ui/google-maps-embed";
import { Mail, MapPin, ExternalLink } from "lucide-react";

const { address } = site.lab;
const mapsQuery = encodeURIComponent(address.mapsQuery ?? `${address.street}, ${address.city}, ${address.country}`);
const mapsEmbedUrl = `https://maps.google.com/maps?q=${mapsQuery}&hl=en&z=17&output=embed`;
const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

export default function ContactPage() {
  return (
    <>
      <PageHero narrow label="Contact" title="Find us" description="Get in touch with the Erturk Lab at iBIO, Helmholtz Munich." />
      <ContentPageShell>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionLabel>Contact information</SectionLabel>
            <div className="mt-8 space-y-6">
              <div>
                <p className="text-base font-medium">General contact</p>
                <a
                  href={`mailto:${site.lab.email}`}
                  className="mt-2 inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {site.lab.email}
                </a>
              </div>
              <div>
                <p className="text-base font-medium">Follow the lab</p>
                <div className="mt-3">
                  <SocialLinks />
                </div>
                <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                  Papers, imaging highlights, and lab news on{" "}
                  <a href={site.lab.social.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--primary)] hover:underline">
                    @erturklab
                  </a>
                </p>
              </div>
              <div>
                <p className="text-base font-medium">Job applications</p>
                <p className="mt-2 text-base text-[var(--muted-foreground)] leading-relaxed">
                  Open positions are announced on Prof. Ertürk&apos;s LinkedIn page. Follow him to stay up to date.
                </p>
                <Link
                  href="/jobs"
                  className="mt-4 inline-flex rounded-full bg-[var(--primary)] px-6 py-2.5 text-base font-medium text-[var(--primary-foreground)]"
                >
                  View open positions
                </Link>
              </div>
            </div>
          </div>

          <div>
            <SectionLabel>Locations</SectionLabel>
            <div className="mt-8 space-y-6">
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-6 transition-colors hover:border-[var(--primary)]/40"
                >
                  <p className="font-medium group-hover:text-[var(--primary)] transition-colors">{site.lab.institute}</p>
                  <p className="mt-1 text-base text-[var(--muted-foreground)]">Helmholtz Munich · Research Center Neuherberg</p>
                  <p className="mt-4 inline-flex items-start gap-2 text-base text-[var(--muted-foreground)]">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[var(--primary)]" />
                    <span>
                      {address.building && (
                        <>
                          {address.building}
                          <br />
                        </>
                      )}
                      {address.street}
                      <br />
                      {address.city}, {address.country}
                    </span>
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)]">
                    Open in Google Maps <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
                <div className="border-t border-[var(--border)]">
                  <GoogleMapsEmbed
                    title="Helmholtz Munich — Building 43, Erturk Lab"
                    src={mapsEmbedUrl}
                    className="h-[200px] w-full md:h-[220px]"
                    previewLabel={`${address.building ?? "iBIO"} · ${address.street}, ${address.city}`}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3">
                    <p className="text-sm text-[var(--muted-foreground)]">
                      {address.building ? `${address.building} · ` : ""}
                      {address.street}, {address.city}
                    </p>
                    <a
                      href={mapsDirectionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)] hover:underline"
                    >
                      Get directions <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentPageShell>
    </>
  );
}
