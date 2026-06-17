import Link from "next/link";
import { authorProfileHref } from "@/lib/author-links";
import { cn } from "@/lib/utils";

export function AuthorName({
  name,
  className,
  linkClassName,
}: {
  name: string;
  className?: string;
  linkClassName?: string;
}) {
  const href = authorProfileHref(name);

  if (!href) {
    return <span className={cn("text-[var(--muted-foreground)]", className)}>{name}</span>;
  }

  return (
    <Link
      href={href}
      className={cn(
        "font-semibold text-[var(--foreground)] hover:text-[var(--primary)] hover:underline underline-offset-2",
        linkClassName,
        className
      )}
    >
      {name}
    </Link>
  );
}
