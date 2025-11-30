import type { TipTapDocument, TipTapNode, TipTapMark } from "@/libs/types/content";

/**
 * Convert TipTap marks to HTML opening tags
 */
const openMarks = (marks?: TipTapMark[]): string => {
  if (!marks || marks.length === 0) return "";

  return marks
    .map((mark) => {
      switch (mark.type) {
        case "bold":
          return "<strong>";
        case "italic":
          return "<em>";
        case "underline":
          return "<u>";
        case "strike":
          return "<s>";
        case "code":
          return "<code>";
        case "link": {
          const href = mark.attrs?.href || "#";
          const target = mark.attrs?.target || "_blank";
          return `<a href="${href}" target="${target}" rel="noopener noreferrer">`;
        }
        case "textStyle": {
          const styles: string[] = [];
          if (mark.attrs?.color) styles.push(`color: ${mark.attrs.color}`);
          if (mark.attrs?.fontSize) styles.push(`font-size: ${mark.attrs.fontSize}`);
          return styles.length > 0 ? `<span style="${styles.join("; ")}">` : "";
        }
        case "highlight": {
          const bgColor = mark.attrs?.color || "yellow";
          return `<mark style="background-color: ${bgColor}">`;
        }
        default:
          return "";
      }
    })
    .join("");
};

/**
 * Convert TipTap marks to HTML closing tags (in reverse order)
 */
const closeMarks = (marks?: TipTapMark[]): string => {
  if (!marks || marks.length === 0) return "";

  return marks
    .slice()
    .reverse()
    .map((mark) => {
      switch (mark.type) {
        case "bold":
          return "</strong>";
        case "italic":
          return "</em>";
        case "underline":
          return "</u>";
        case "strike":
          return "</s>";
        case "code":
          return "</code>";
        case "link":
          return "</a>";
        case "textStyle":
          return mark.attrs?.color || mark.attrs?.fontSize ? "</span>" : "";
        case "highlight":
          return "</mark>";
        default:
          return "";
      }
    })
    .join("");
};

/**
 * Escape HTML special characters
 */
const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/**
 * Convert a single TipTap node to HTML
 */
const nodeToHtml = (node: TipTapNode): string => {
  switch (node.type) {
    case "doc":
      return (node.content || []).map(nodeToHtml).join("");

    case "paragraph": {
      const pContent = (node.content || []).map(nodeToHtml).join("");
      return `<p>${pContent || "<br>"}</p>`;
    }

    case "text": {
      const text = escapeHtml(node.text || "");
      return `${openMarks(node.marks)}${text}${closeMarks(node.marks)}`;
    }

    case "heading": {
      const level = node.attrs?.level || 1;
      const headingContent = (node.content || []).map(nodeToHtml).join("");
      return `<h${level}>${headingContent}</h${level}>`;
    }

    case "bulletList": {
      const ulItems = (node.content || []).map(nodeToHtml).join("");
      return `<ul>${ulItems}</ul>`;
    }

    case "orderedList": {
      const start = node.attrs?.start || 1;
      const olItems = (node.content || []).map(nodeToHtml).join("");
      return `<ol start="${start}">${olItems}</ol>`;
    }

    case "listItem": {
      const liContent = (node.content || []).map(nodeToHtml).join("");
      return `<li>${liContent}</li>`;
    }

    case "blockquote": {
      const bqContent = (node.content || []).map(nodeToHtml).join("");
      return `<blockquote>${bqContent}</blockquote>`;
    }

    case "codeBlock": {
      const language = node.attrs?.language || "";
      const codeContent = (node.content || []).map((n) => n.text || "").join("");
      return `<pre><code class="language-${language}">${escapeHtml(codeContent)}</code></pre>`;
    }

    case "horizontalRule":
      return "<hr>";

    case "hardBreak":
      return "<br>";

    case "image": {
      const src = node.attrs?.src || "";
      const alt = node.attrs?.alt || "";
      const title = node.attrs?.title || "";
      return `<img src="${src}" alt="${escapeHtml(alt)}" title="${escapeHtml(title)}" />`;
    }

    case "youtube": {
      const ytSrc = node.attrs?.src || "";
      const width = node.attrs?.width || 640;
      const height = node.attrs?.height || 480;
      // Extract video ID from YouTube URL
      const videoIdMatch = ytSrc.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      const videoId = videoIdMatch ? videoIdMatch[1] : "";
      if (videoId) {
        return `<div class="youtube-embed"><iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`;
      }
      return "";
    }

    case "table": {
      const tableContent = (node.content || []).map(nodeToHtml).join("");
      return `<table>${tableContent}</table>`;
    }

    case "tableRow": {
      const rowContent = (node.content || []).map(nodeToHtml).join("");
      return `<tr>${rowContent}</tr>`;
    }

    case "tableCell": {
      const cellContent = (node.content || []).map(nodeToHtml).join("");
      const colspan = node.attrs?.colspan || 1;
      const rowspan = node.attrs?.rowspan || 1;
      return `<td colspan="${colspan}" rowspan="${rowspan}">${cellContent}</td>`;
    }

    case "tableHeader": {
      const headerContent = (node.content || []).map(nodeToHtml).join("");
      const thColspan = node.attrs?.colspan || 1;
      const thRowspan = node.attrs?.rowspan || 1;
      return `<th colspan="${thColspan}" rowspan="${thRowspan}">${headerContent}</th>`;
    }

    default:
      // For unknown node types, try to render content if available
      if (node.content) {
        return (node.content || []).map(nodeToHtml).join("");
      }
      return "";
  }
};

/**
 * Convert TipTap JSON document to HTML string
 */
export const tiptapToHtml = (doc: TipTapDocument | string): string => {
  if (typeof doc === "string") {
    try {
      const parsed = JSON.parse(doc);
      if (parsed.type === "doc") {
        return nodeToHtml(parsed);
      }
      return doc;
    } catch {
      return doc;
    }
  }

  if (doc.type === "doc") {
    return nodeToHtml(doc);
  }

  return "";
};

/**
 * Check if a string is valid TipTap JSON
 */
export const isTipTapJson = (content: string): boolean => {
  try {
    const parsed = JSON.parse(content);
    return parsed.type === "doc" && Array.isArray(parsed.content);
  } catch {
    return false;
  }
};

/**
 * Parse and validate TipTap JSON, returns null if invalid
 */
export const parseTipTapJson = (content: string): TipTapDocument | null => {
  try {
    const parsed = JSON.parse(content);
    if (parsed.type === "doc" && Array.isArray(parsed.content)) {
      return parsed as TipTapDocument;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Extract plain text from TipTap document (for excerpts, previews, etc.)
 */
export const tiptapToPlainText = (doc: TipTapDocument | string): string => {
  const extractText = (node: TipTapNode): string => {
    if (node.type === "text") {
      return node.text || "";
    }
    if (node.content) {
      return node.content.map(extractText).join(" ");
    }
    return "";
  };

  if (typeof doc === "string") {
    try {
      const parsed = JSON.parse(doc);
      if (parsed.type === "doc") {
        return extractText(parsed).trim();
      }
      return doc;
    } catch {
      return doc;
    }
  }

  return extractText(doc).trim();
};
