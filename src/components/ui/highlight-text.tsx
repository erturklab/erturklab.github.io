import { splitTextWithHighlights } from "@/lib/mission-highlights";
import { cn } from "@/lib/utils";

interface HighlightTextProps {
  text: string;
  className?: string;
  as?: "p" | "span";
}

export function HighlightText({ text, className, as: Tag = "p" }: HighlightTextProps) {
  const parts = splitTextWithHighlights(text);

  return (
    <Tag className={className}>
      {parts.map((part, i) =>
        part.highlight ? (
          <strong key={`${part.text}-${i}`} className="font-semibold text-[var(--foreground)]">
            {part.text}
          </strong>
        ) : (
          <span key={`${part.text}-${i}`}>{part.text}</span>
        )
      )}
    </Tag>
  );
}

interface MissionCopyProps {
  paragraphs: string[];
  className?: string;
}

export function MissionCopy({ paragraphs, className }: MissionCopyProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {paragraphs.map((paragraph) => (
        <HighlightText
          key={paragraph}
          text={paragraph}
          className="text-base md:text-lg leading-relaxed text-[var(--muted-foreground)]"
        />
      ))}
    </div>
  );
}
