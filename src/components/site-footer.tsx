import Link from "next/link";
import site from "@/content/site.json";
import { PartnerStrip } from "@/components/ui/institute-logos";
import { SocialLinks } from "@/components/ui/social-links";
import { ResetContentPreferences } from "@/components/privacy-preferences";

const technologyLinks = [
  { href: "/research", label: "Research overview" },
  { href: "/research/projects", label: "Projects" },
  { href: "/publications", label: "Publications" },
];

const instituteLinks = [
  { href: "/team", label: "Team" },
  { href: "/jobs", label: "Jobs" },
  { href: "/science-art", label: "Science Art" },
];

const connectLinks = [{ href: "/contact", label: "Contact" }];

const legalLinks = [
  { href: "/imprint", label: "Imprint" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="mt-0 border-t border-[var(--border)] bg-[var(--card)]/30">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        {/* Brand */}
        <div className="text-center md:text-left">
          <p className="font-display text-2xl">{site.lab.name}</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{site.lab.institute}</p>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">{site.lab.location}</p>
          <div className="mt-6 flex flex-col items-center md:items-start">
            <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
              Follow us
            </p>
            <SocialLinks />
          </div>
        </div>

        {/* Links */}
        <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[var(--border)] pt-10 md:gap-8">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
              Research
            </p>
            <ul className="mt-4 space-y-2">
              {technologyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--muted-foreground)]">
              Institute
            </p>
            <ul className="mt-4 space-y-2">
              {instituteLinks.map((l) => (
                <li key={`${l.href}-${l.label}`}>
                  <Link href={l.href} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-[var(--muted-foreground)]">Connect</p>
            <ul className="mt-4 space-y-2">
              {connectLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[11px] font-medium uppercase tracking-widest text-[var(--muted-foreground)]">Legal</p>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-[var(--border)]/50 pt-3">
              <ResetContentPreferences utility />
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-[var(--border)] pt-10">
          <PartnerStrip />
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-8 text-xs text-[var(--muted-foreground)]">
          <p>© {new Date().getFullYear()} {site.lab.name}. All rights reserved.</p>
          <p>AI · Imaging · Nanotechnology</p>
        </div>
      </div>
    </footer>
  );
}
