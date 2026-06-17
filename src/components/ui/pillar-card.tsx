import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PillarCardProps {
  index?: string;
  title: string;
  summary: string;
  href: string;
  icon: LucideIcon;
  className?: string;
}

export function PillarCard({ index, title, summary, href, icon: Icon, className }: PillarCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 overflow-hidden transition-all duration-300",
        "hover:border-[var(--primary)]/40 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--primary)]/5 blur-2xl transition-opacity group-hover:opacity-150" />
      <div className={cn("flex items-start", index ? "justify-between" : "justify-end")}>
        {index ? <span className="text-xs font-mono text-[var(--muted-foreground)]">{index}</span> : null}
        <Icon className="h-5 w-5 text-[var(--primary)] opacity-80" />
      </div>
      <h3 className={cn("text-xl font-semibold leading-snug", index ? "mt-6" : "mt-4")}>{title}</h3>
      <p className="mt-3 flex-1 text-sm text-[var(--muted-foreground)] leading-relaxed">{summary}</p>
      <span className="mt-6 inline-flex items-center gap-1 text-sm text-[var(--primary)] opacity-0 transition-opacity group-hover:opacity-100">
        Explore <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
