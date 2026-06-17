import { Globe, GraduationCap, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./section-label";

export interface TeamMemberLinks {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  googleScholar?: string;
  orcid?: string;
  personalWebsite?: string;
  wikipedia?: string;
  twitter?: string;
  bluesky?: string;
}

function normalizeUrl(value: string, prefix: string): string {
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const handle = value.replace(/^@/, "");
  return `${prefix}${handle}`;
}

export function twitterHref(value: string): string {
  if (value.startsWith("http")) return value;
  const handle = value.replace(/^@/, "");
  return `https://x.com/${handle}`;
}

export function blueskyHref(value: string): string {
  if (value.startsWith("http")) return value;
  const handle = value.replace(/^@/, "").replace(/\.bsky\.social$/, "");
  return `https://bsky.app/profile/${handle}.bsky.social`;
}

function orcidHref(value: string): string {
  if (value.startsWith("http")) return value;
  return `https://orcid.org/${value.replace(/^https?:\/\/orcid\.org\//, "")}`;
}

function orcidId(value: string): string {
  return value.replace(/^https?:\/\/orcid\.org\//, "");
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function WikipediaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l.136.046 2.411-4.81-.482-1.067-1.658-3.264s-.318-.654-.428-.872c-.728-1.443-.712-1.518-1.447-1.617-.207-.023-.313-.05-.313-.149v-.468l.06-.045h4.292l.113.037v.451c0 .105-.076.15-.227.15l-.308.047c-.792.061-.661.381-.136 1.422l1.582 3.252 1.758-3.504c.293-.64.233-.801.111-.947-.07-.084-.305-.22-.812-.24l-.201-.021c-.052 0-.098-.015-.145-.051-.045-.031-.067-.076-.067-.129v-.427l.061-.045c1.247-.008 4.043 0 4.043 0l.059.045v.436c0 .121-.059.178-.193.178-.646.03-.782.095-1.023.439-.12.186-.375.589-.646 1.039l-2.301 4.273-.065.135 2.792 5.712.17.048 4.396-10.438c.154-.422.129-.722-.064-.895-.197-.172-.346-.273-.857-.295l-.42-.016c-.061 0-.105-.014-.152-.045-.043-.029-.072-.075-.072-.119v-.436l.059-.045h4.961l.041.045v.437c0 .119-.074.18-.209.18-.648.03-1.127.18-1.443.421-.314.255-.557.616-.736 1.067 0 0-4.043 9.258-5.426 12.339-.525 1.007-1.053.917-1.503-.031-.571-1.171-1.773-3.786-2.646-5.71l.053-.036z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364-.001.002-.001.004-.001.006-.372.298-.694.638-.949 1.016-1.229 1.955-1.329 4.76-.329 6.557 1.022 1.842 3.144 2.827 5.272 2.514 2.127-.312 3.833-1.789 4.682-3.702.849-1.913.767-4.196-.221-6.042-.372-.697-.836-1.332-1.371-1.887-.003 0-.006-.001-.008-.002 2.67.296 5.568-.628 6.383-3.364.246-.828.624-5.789.624-6.479 0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C16.046 4.747 13.087 8.686 12 10.8z" />
    </svg>
  );
}

function OrcidIcon({ className }: { className?: string }) {
  return (
    // Official ORCID iD icon — use unmodified per https://info.orcid.org/brand-guidelines/
    <img src="/logos/orcid-id.svg" alt="" aria-hidden className={className} />
  );
}

const contactLinkClass =
  "inline-flex min-w-0 items-center gap-2.5 hover:text-[var(--primary)] hover:underline underline-offset-4";
const contactIconClass = "h-4 w-4 shrink-0 text-[var(--muted-foreground)]";
const orcidIconClass = "h-4 w-4 shrink-0";

/** Social & academic profiles — icon row under the name (not email / ORCID; those go in Contact information). */
const iconLinkConfig = [
  { key: "linkedin" as const, label: "LinkedIn", icon: LinkedInIcon, href: (v: string) => v },
  { key: "github" as const, label: "GitHub", icon: GitHubIcon, href: (v: string) => v },
  { key: "googleScholar" as const, label: "Google Scholar", icon: GraduationCap, href: (v: string) => v },
  { key: "wikipedia" as const, label: "Wikipedia", icon: WikipediaIcon, href: (v: string) => v },
  { key: "twitter" as const, label: "X", icon: XIcon, href: twitterHref },
  { key: "bluesky" as const, label: "Bluesky", icon: BlueskyIcon, href: blueskyHref },
  { key: "personalWebsite" as const, label: "Website", icon: Globe, href: (v: string) => normalizeUrl(v, "https://") },
];

export function TeamMemberLinksRow({ links, className }: { links?: TeamMemberLinks; className?: string }) {
  if (!links) return null;

  const items = iconLinkConfig
    .map(({ key, label, icon: Icon, href }) => {
      const value = links[key];
      if (!value) return null;
      return (
        <a
          key={key}
          href={href(value)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} profile`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)]/80 text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
        >
          <Icon className="h-4 w-4" aria-hidden />
        </a>
      );
    })
    .filter(Boolean);

  if (items.length === 0) return null;

  return <div className={cn("flex flex-wrap justify-center gap-2", className)}>{items}</div>;
}

/** Profile footer: email, phone, ORCID only. */
export function TeamContactInformation({ links, className }: { links?: TeamMemberLinks; className?: string }) {
  if (!links) return null;

  const hasContact = links.email || links.phone || links.orcid;
  if (!hasContact) return null;

  return (
    <section className={cn("mt-10", className)}>
      <SectionLabel>Contact information</SectionLabel>
      <div className="mt-5 space-y-3 text-sm leading-relaxed text-[var(--muted-foreground)] md:text-base">
        {links.email && (
          <p>
            <a href={`mailto:${links.email}`} className={contactLinkClass}>
              <Mail className={contactIconClass} aria-hidden />
              <span>{links.email}</span>
            </a>
          </p>
        )}
        {links.phone && (
          <p>
            <a href={`tel:${links.phone.replace(/[\s()-]/g, "")}`} className={contactLinkClass}>
              <Phone className={contactIconClass} aria-hidden />
              <span>{links.phone}</span>
            </a>
          </p>
        )}
        {links.orcid && (
          <p>
            <a
              href={orcidHref(links.orcid)}
              target="_blank"
              rel="noopener noreferrer"
              className={contactLinkClass}
            >
              <OrcidIcon className={orcidIconClass} />
              <span>{orcidId(links.orcid)}</span>
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
