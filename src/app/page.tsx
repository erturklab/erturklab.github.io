import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, ExternalLink } from "lucide-react";
import site from "@/content/site.json";
import { SectionLabel } from "@/components/ui/section-label";
import { PublicationCard } from "@/components/ui/publication-card";
import { AltmetricInit } from "@/components/ui/altmetric-badge";
import { TechnologyCarousel } from "@/components/ui/technology-carousel";
import { HeroImmersive } from "@/components/ui/hero-immersive";
import { MissionCopy } from "@/components/ui/highlight-text";
import { TeamGrid } from "@/components/ui/team-grid";
import { SocialLinks } from "@/components/ui/social-links";
import { GoogleMapsEmbed } from "@/components/ui/google-maps-embed";
import { getFeaturedPublications, getPublicationKey, getSitePublications } from "@/lib/publications";
import { getProjects } from "@/lib/projects";
import { teamMembers } from "@/lib/team";

export const metadata: Metadata = { title: "Home" };

const featuredPublications = getFeaturedPublications(getSitePublications());
const projects = getProjects();

export default function HomePage() {
  return (
    <>
      <Script
        src="https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js"
        strategy="afterInteractive"
      />
      <AltmetricInit />
      <HeroImmersive
        institute={`${site.lab.institute} · Helmholtz Munich`}
        tagline="Mapping biology"
        taglineAccent="in three dimensions"
        subtitle="Enabling technologies for whole-body biology and precision medicine — from transparent tissue to single-cell maps."
        pillars={site.heroFeatures}
      />

      <section className="page-section mx-auto max-w-6xl px-4 py-24 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <SectionLabel>Our mission</SectionLabel>
            <h2 className="font-display mt-4 text-3xl md:text-4xl leading-tight">
              {site.lab.missionHeadline}
            </h2>
          </div>
          <MissionCopy paragraphs={site.lab.missionParagraphs} />
        </div>
      </section>

      <section id="technologies" className="page-section pb-24 md:pb-32 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionLabel>Our technologies</SectionLabel>
          <h2 className="font-display mt-3 text-3xl md:text-5xl max-w-3xl leading-tight">
            Whole-body imaging platforms we built
          </h2>
          <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
            DISCO tissue clearing, light-sheet microscopy, and deep learning — integrated pipelines that render entire organisms transparent and map them at single-cell resolution.
          </p>
          <div className="mt-10 md:mt-14">
            <TechnologyCarousel items={projects} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--border)] pt-8">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50"
            >
              Research overview
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/research/projects"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50"
            >
              View all projects
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Publications */}
      <section id="publications" className="page-section border-t border-[var(--border)] bg-[var(--card)]/40 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-24 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>Publications</SectionLabel>
              <h2 className="font-display mt-3 text-3xl md:text-4xl">Selected publications</h2>
              <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
                Recent flagship papers from the lab.
              </p>
            </div>
            <Link href="/publications" className="text-sm text-[var(--primary)] hover:underline">
              Explore all publications →
            </Link>
          </div>
          <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
            {featuredPublications.slice(0, 3).map(({ featured: _h, ...pub }) => (
              <PublicationCard key={getPublicationKey(pub)} {...pub} />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="page-section border-t border-[var(--border)] scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-24 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <SectionLabel>Team</SectionLabel>
              <h2 className="font-display mt-3 text-3xl md:text-4xl">Our team</h2>
              <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
                An interdisciplinary group at iBIO, Helmholtz Munich.
              </p>
            </div>
            <Link href="/team" className="text-sm text-[var(--primary)] hover:underline">
              View all profiles →
            </Link>
          </div>
          <TeamGrid members={teamMembers} />
        </div>
      </section>

      {/* Jobs */}
      <section id="jobs" className="page-section border-t border-[var(--border)] bg-[var(--card)]/40 scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-24 md:px-6">
          <SectionLabel>Careers</SectionLabel>
          <h2 className="font-display mt-3 text-3xl md:text-4xl">Open positions</h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
            We are always looking for motivated scientists to join the Ertürk Lab.
          </p>
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
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
                  href={`mailto:${site.lab.email}`}
                  className="mt-2 inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {site.lab.email}
                </a>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">What to include in your application</p>
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4">
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
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="page-section border-t border-[var(--border)] scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 py-24 md:px-6">
          <SectionLabel>Contact</SectionLabel>
          <h2 className="font-display mt-3 text-3xl md:text-4xl">Find us</h2>
          <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
            Get in touch with the Ertürk Lab at iBIO, Helmholtz Munich.
          </p>
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div className="space-y-8">
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
                  Open positions are announced on Prof. Ertürk&apos;s LinkedIn page.
                </p>
                <Link
                  href="#jobs"
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:border-[var(--primary)]/50"
                >
                  View open positions <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div>
              <p className="text-base font-medium mb-6">Location</p>
              <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.lab.address.mapsQuery ?? `${site.lab.address.street}, ${site.lab.address.city}, ${site.lab.address.country}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-6 transition-colors hover:bg-[var(--secondary)]/50"
                >
                  <p className="font-medium group-hover:text-[var(--primary)] transition-colors">{site.lab.institute}</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">Helmholtz Munich · Research Center Neuherberg</p>
                  <p className="mt-4 inline-flex items-start gap-2 text-sm text-[var(--muted-foreground)]">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-[var(--primary)]" />
                    <span>
                      {site.lab.address.building && <>{site.lab.address.building}<br /></>}
                      {site.lab.address.street}<br />
                      {site.lab.address.city}, {site.lab.address.country}
                    </span>
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--primary)]">
                    Get directions <ExternalLink className="h-3 w-3" />
                  </span>
                </a>
                <div className="border-t border-[var(--border)]">
                  <GoogleMapsEmbed
                    title="Helmholtz Munich — Building 43, Erturk Lab"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(site.lab.address.mapsQuery ?? `${site.lab.address.street}, ${site.lab.address.city}, ${site.lab.address.country}`)}&hl=en&z=17&output=embed`}
                    className="h-[200px] w-full md:h-[220px]"
                    previewLabel={`${site.lab.address.building ?? "iBIO"} · ${site.lab.address.street}, ${site.lab.address.city}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
