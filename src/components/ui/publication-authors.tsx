"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { parseAuthorList } from "@/lib/author-links";
import { AuthorName } from "./author-name";

interface PublicationAuthorsProps {
  authors: string;
  className?: string;
  collapsedClassName?: string;
  onExpandedChange?: (expanded: boolean) => void;
}

export function PublicationAuthors({
  authors,
  className,
  collapsedClassName,
  onExpandedChange,
}: PublicationAuthorsProps) {
  const [expanded, setExpanded] = useState(false);
  const authorList = parseAuthorList(authors);
  const canExpand = authorList.length > 1;

  function toggleExpanded() {
    const next = !expanded;
    setExpanded(next);
    onExpandedChange?.(next);
  }

  if (!canExpand) {
    return (
      <p className={cn("text-left text-sm leading-relaxed text-[var(--muted-foreground)]", className)}>
        <AuthorName name={authorList[0] ?? authors} />
      </p>
    );
  }

  return (
    <div className={cn("text-left", className)}>
      {expanded ? (
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
          {authorList.map((name, index) => (
            <span key={`${name}-${index}`}>
              {index > 0 && ", "}
              <AuthorName name={name} />
            </span>
          ))}
        </p>
      ) : (
        <p
          className={cn(
            "text-sm leading-relaxed text-[var(--muted-foreground)]",
            collapsedClassName
          )}
        >
          <AuthorName name={authorList[0]} />
          {authorList.length > 1 && " et al."}
        </p>
      )}
      <button
        type="button"
        onClick={toggleExpanded}
        className="mt-1.5 block text-left text-xs font-medium text-[var(--primary)] hover:underline"
        aria-expanded={expanded}
      >
        {expanded ? "Show less" : "Show all authors"}
      </button>
    </div>
  );
}
