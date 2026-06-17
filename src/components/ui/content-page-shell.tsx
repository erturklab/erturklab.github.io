import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Narrower layout + wider side margins — Team, Jobs, Contact, legal pages only. Homepage stays max-w-6xl. */
export const contentPageContainerClass =
  "mx-auto max-w-6xl px-4 py-16 md:px-6";

export const contentPageHeroOuterClass =
  "relative mx-auto max-w-6xl px-4 md:px-6 w-full";

export function ContentPageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(contentPageContainerClass, className)}>{children}</div>;
}
