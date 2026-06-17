/**
 * Lightweight Markdown renderer for job descriptions (no extra dependencies).
 * Supports: ##/### headers, **bold**, *italic*, [links](url), - bullet lists, paragraphs.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sanitizeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^\/[^\s]*$/.test(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:" || parsed.protocol === "mailto:") {
      return parsed.href;
    }
  } catch {
    return null;
  }
  return null;
}

function applyBasicInline(escaped: string): string {
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function inlineMarkdown(text: string): string {
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let result = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRe.exec(text)) !== null) {
    result += applyBasicInline(escapeHtml(text.slice(lastIndex, match.index)));
    const href = sanitizeUrl(match[2]);
    if (href) {
      result += `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(match[1])}</a>`;
    } else {
      result += escapeHtml(match[0]);
    }
    lastIndex = match.index + match[0].length;
  }

  result += applyBasicInline(escapeHtml(text.slice(lastIndex)));
  return result;
}

export function renderInlineMarkdown(text: string): string {
  return inlineMarkdown(text);
}

export function markdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inList = false;

  function closeList() {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  }

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      continue;
    }

    const h3 = trimmed.match(/^###\s+(.+)$/);
    if (h3) {
      closeList();
      out.push(`<h3>${inlineMarkdown(h3[1])}</h3>`);
      continue;
    }

    const h2 = trimmed.match(/^##\s+(.+)$/);
    if (h2) {
      closeList();
      out.push(`<h2>${inlineMarkdown(h2[1])}</h2>`);
      continue;
    }

    const h1 = trimmed.match(/^#\s+(.+)$/);
    if (h1) {
      closeList();
      out.push(`<h2>${inlineMarkdown(h1[1])}</h2>`);
      continue;
    }

    const bullet = trimmed.match(/^[-*•]\s+(.+)$/);
    if (bullet) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inlineMarkdown(bullet[1])}</li>`);
      continue;
    }

    closeList();
    out.push(`<p>${inlineMarkdown(trimmed)}</p>`);
  }

  closeList();
  return out.join("\n");
}
