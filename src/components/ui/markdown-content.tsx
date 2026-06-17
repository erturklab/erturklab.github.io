import { markdownToHtml } from "@/lib/markdown";

export function MarkdownContent({ markdown, className = "" }: { markdown: string; className?: string }) {
  const html = markdownToHtml(markdown);

  return (
    <div
      className={`job-markdown ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
