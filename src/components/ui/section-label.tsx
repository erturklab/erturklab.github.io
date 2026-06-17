import { cn } from "@/lib/utils";

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--primary)]", className)}>
      {children}
    </p>
  );
}
