"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { ThemePicker } from "@/components/theme-picker";
import { cn } from "@/lib/utils";

const LAB_MARK_SRC = "/logos/erturk-lab-mark-header.png";

type NavDropdownItem = {
  href: string;
  label: string;
  description?: string;
  isActive: (pathname: string) => boolean;
};

const technologyResearchLinks: NavDropdownItem[] = [
  {
    href: "/research",
    label: "Overview",
    description: "Research pillars & mission",
    isActive: (pathname) => pathname === "/research",
  },
  {
    href: "/research/projects",
    label: "Projects",
    description: "Lab platforms & technologies",
    isActive: (pathname) => pathname.startsWith("/research/projects"),
  },
  {
    href: "/publications",
    label: "Publications",
    description: "Papers & preprints",
    isActive: (pathname) => pathname === "/publications",
  },
];

const instituteLinks: NavDropdownItem[] = [
  {
    href: "/team",
    label: "Team",
    description: "People in the lab",
    isActive: (pathname) => pathname === "/team" || pathname.startsWith("/team/"),
  },
  {
    href: "/jobs",
    label: "Jobs",
    description: "Open positions & careers",
    isActive: (pathname) => pathname === "/jobs" || pathname.startsWith("/jobs/"),
  },
];

const contactHref = "/contact";

function isTechnologyResearchActive(pathname: string) {
  return pathname === "/research" || pathname.startsWith("/research/") || pathname === "/publications";
}

function isInstituteActive(pathname: string) {
  return (
    pathname === "/team" ||
    pathname.startsWith("/team/") ||
    pathname === "/jobs" ||
    pathname.startsWith("/jobs/")
  );
}

function LabMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- header mark PNG (cropped from concept art)
    <img
      src={LAB_MARK_SRC}
      alt=""
      width={36}
      height={36}
      className={cn("h-full w-full object-cover object-center", className)}
    />
  );
}

function HomeLogoLink({ isHome, className }: { isHome: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Ertürk Lab home"
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border transition-colors",
        "bg-[#050508]",
        isHome
          ? "border-[var(--primary)]/50 ring-1 ring-[var(--primary)]/20"
          : "border-[var(--border)] hover:border-[var(--primary)]/40",
        className
      )}
    >
      <LabMark />
    </Link>
  );
}

function NavDropdown({
  label,
  mobileLabel,
  items,
  active,
  pathname,
  onNavigate,
}: {
  label: string;
  mobileLabel?: string;
  items: NavDropdownItem[];
  active: boolean;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
          active
            ? "bg-[var(--secondary)] text-[var(--primary)]"
            : "text-[var(--foreground)]/75 hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/50"
        )}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="hidden lg:inline">{label}</span>
        <span className="lg:hidden">{mobileLabel ?? label}</span>
        <ChevronDown className={cn("h-4 w-4 opacity-70 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 pt-2">
          <div className="min-w-[15rem] overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-xl shadow-black/20">
            {items.map((item) => {
              const itemActive = item.isActive(pathname);
              return (
                <Link
                  key={`${item.href}-${item.label}`}
                  href={item.href}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 transition-colors",
                    itemActive
                      ? "bg-[var(--secondary)] text-[var(--primary)]"
                      : "text-[var(--foreground)] hover:bg-[var(--secondary)]/70"
                  )}
                >
                  <span className="block text-[15px] font-medium">{item.label}</span>
                  {item.description ? (
                    <span className="mt-0.5 block text-[11px] text-[var(--muted-foreground)]">{item.description}</span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileNavSection({
  title,
  items,
  open,
  onToggle,
  active,
  onNavigate,
}: {
  title: string;
  items: NavDropdownItem[];
  open: boolean;
  onToggle: () => void;
  active: boolean;
  onNavigate: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium",
          active
            ? "bg-[var(--secondary)] text-[var(--primary)]"
            : "text-[var(--foreground)]/80 hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
        )}
      >
        {title}
        <ChevronDown className={cn("h-[18px] w-[18px] transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-[var(--border)] pl-3">
          {items.map((item) => (
            <Link
              key={`${item.href}-${item.label}`}
              href={item.href}
              onClick={onNavigate}
              className="block rounded-lg px-3 py-2.5 text-[var(--foreground)]/75 hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
            >
              <span className="block text-[15px] font-medium">{item.label}</span>
              {item.description && (
                <span className="mt-0.5 block text-[11px] text-[var(--muted-foreground)]">{item.description}</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [techMobileOpen, setTechMobileOpen] = useState(false);
  const [instituteMobileOpen, setInstituteMobileOpen] = useState(false);
  const isHome = pathname === "/";

  const closeMobile = () => {
    setOpen(false);
    setTechMobileOpen(false);
    setInstituteMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)]/80 bg-[color-mix(in_srgb,var(--background)_80%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <HomeLogoLink isHome={isHome} />
          <Link href="/" className="group block min-w-0">
            <span className="block text-base font-semibold tracking-tight group-hover:text-[var(--primary)] transition-colors md:text-lg">
              ErtürkLab
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-0.5 md:flex">
          <NavDropdown
            label="Technology & Research"
            mobileLabel="Tech & Research"
            items={technologyResearchLinks}
            active={isTechnologyResearchActive(pathname)}
            pathname={pathname}
          />
          <NavDropdown
            label="Institute"
            items={instituteLinks}
            active={isInstituteActive(pathname)}
            pathname={pathname}
          />
          <Link
            href={contactHref}
            className={cn(
              "rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
              pathname === contactHref || pathname.startsWith(`${contactHref}/`)
                ? "bg-[var(--secondary)] text-[var(--primary)]"
                : "text-[var(--foreground)]/75 hover:text-[var(--foreground)] hover:bg-[var(--secondary)]/50"
            )}
          >
            Contact
          </Link>
          <div className="ml-2 flex items-center gap-2 pl-2 border-l border-[var(--border)]">
            <ThemePicker compact />
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemePicker />
          <button type="button" onClick={() => setOpen(!open)} aria-label="Menu" className="rounded-lg p-2 hover:bg-[var(--secondary)]">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--border)] px-4 py-3 md:hidden">
          <MobileNavSection
            title="Technology & Research"
            items={technologyResearchLinks}
            open={techMobileOpen}
            onToggle={() => setTechMobileOpen(!techMobileOpen)}
            active={isTechnologyResearchActive(pathname)}
            onNavigate={closeMobile}
          />
          <MobileNavSection
            title="Institute"
            items={instituteLinks}
            open={instituteMobileOpen}
            onToggle={() => setInstituteMobileOpen(!instituteMobileOpen)}
            active={isInstituteActive(pathname)}
            onNavigate={closeMobile}
          />
          <Link
            href={contactHref}
            onClick={closeMobile}
            className="flex rounded-lg px-3 py-3 text-base font-medium text-[var(--foreground)]/80 hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
          >
            Contact
          </Link>
        </nav>
      )}
    </header>
  );
}
