import { cn } from "@/lib/utils";

export interface AlumniEntry {
  name: string;
  title?: string;
  role: string;
  startYear?: number;
  startMonth?: number;
  endYear?: number;
  endMonth?: number;
  linkedin?: string;
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** Format display name — prepend Dr. title if present. */
export function formatAlumniName(entry: AlumniEntry): string {
  const base = entry.name.replace(/^Dr\.?\s+/i, "").trim();
  return entry.title === "Dr." ? `Dr. ${base}` : base;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtPeriod(month?: number, year?: number): string | null {
  if (year && month) return `${MONTHS[month - 1]} ${year}`;
  if (year) return `${year}`;
  return null;
}

function formatDuration(entry: AlumniEntry) {
  const start = fmtPeriod(entry.startMonth, entry.startYear);
  const end = fmtPeriod(entry.endMonth, entry.endYear);
  if (start && end) return `${start} - ${end}`;
  if (end) return `Until ${end}`;
  if (start) return `From ${start}`;
  return null;
}

export function AlumniList({ entries, intro }: { entries: AlumniEntry[]; intro?: string }) {
  const sorted = [...entries].sort((a, b) => {
    const yearA = a.endYear ?? a.startYear ?? 0;
    const yearB = b.endYear ?? b.startYear ?? 0;
    if (yearB !== yearA) return yearB - yearA;
    const monthA = (a.endYear ? a.endMonth : a.startMonth) ?? 0;
    const monthB = (b.endYear ? b.endMonth : b.startMonth) ?? 0;
    if (monthB !== monthA) return monthB - monthA;
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      {intro && <p className="mt-2 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)]">{intro}</p>}
      <div className={cn("mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4", !intro && "mt-0")}>
        {sorted.map((entry) => {
          const duration = formatDuration(entry);
          const displayName = formatAlumniName(entry);
          return (
            <article
              key={`${entry.name}-${entry.role}`}
              className="flex h-[8rem] flex-col px-5 pt-3.5 pb-2 transition-colors rounded-xl border border-[var(--border)] bg-[var(--card)]/50 hover:border-[var(--primary)]/30"
            >
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--foreground)]">
                {displayName}
              </h3>
              <div className="mt-2 flex flex-col gap-2">
                <p className="text-[11px] font-medium leading-snug text-[var(--primary)]">{entry.role}</p>
                <p className="min-h-[1.125rem] text-[11px] tabular-nums leading-snug text-[var(--muted-foreground)]">
                  {duration ?? <span className="invisible select-none" aria-hidden>0000–0000</span>}
                </p>
                <div>
                  {entry.linkedin ? (
                    <a
                      href={entry.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--primary)] underline-offset-2 hover:underline"
                    >
                      <LinkedInIcon className="h-3 w-3 shrink-0" />
                      LinkedIn
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]/40">
                      <LinkedInIcon className="h-3 w-3 shrink-0" />
                      LinkedIn
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
