import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Youtube from "@tiptap/extension-youtube"; // Import the official Youtube extension
import { VideoExtension } from "@/components/global/tiptap-extensions/VideoExtension";

/**
 * Convert TipTap JSON content to HTML
 * @param json - TipTap JSON content (can be string or object)
 * @returns HTML string
 */
export const tiptapJsonToHtml = (json: string | object | null | undefined): string => {
  if (!json) return "";

  try {
    // If it's a string, try to parse it as JSON
    const jsonContent = typeof json === "string" ? JSON.parse(json) : json;

    // Validate that it's a proper TipTap document
    if (!jsonContent || typeof jsonContent !== "object" || !("type" in jsonContent)) {
      return typeof json === "string" ? json : "";
    }

    // Generate HTML from TipTap JSON using the extensions
    const html = generateHTML(jsonContent, [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto",
        },
      }),
      // Official Youtube Extension Configuration
      Youtube.configure({
        controls: true,
        nocookie: true,
        allowFullscreen: true,
        autoplay: false,
        ccLanguage: "en",
        width: 640,
        height: 480,
        // Ensure the iframe has responsive styling classes if you use Tailwind
        HTMLAttributes: {
          class: "w-full aspect-video h-auto rounded-lg shadow-md",
        },
      }),
      // Keep your custom video extension if it handles local video files
      VideoExtension,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: "highlight",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph", "image", "video", "youtube"], // Added 'youtube' to text align support
      }),
    ]);

    return html;
  } catch (error) {
    console.error("Error converting TipTap JSON to HTML:", error);
    // If conversion fails, return the original content or empty string
    return typeof json === "string" ? json : "";
  }
};

/**
 * Check if content is TipTap JSON format
 * @param content - Content to check
 * @returns true if content is TipTap JSON
 */
export const isTiptapJson = (content: string | object | null | undefined): boolean => {
  if (!content) return false;

  try {
    const parsed = typeof content === "string" ? JSON.parse(content) : content;
    return (
      parsed &&
      typeof parsed === "object" &&
      "type" in parsed &&
      parsed.type === "doc" &&
      "content" in parsed
    );
  } catch {
    return false;
  }
};
