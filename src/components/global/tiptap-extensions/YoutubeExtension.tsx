import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";

export interface YoutubeOptions {
  allowFullscreen: boolean;
  HTMLAttributes: Record<string, any>;
}

// React component for rendering YouTube videos in the editor
const YoutubeComponent = ({ node }: { node: any }) => {
  const { src, width = 640 } = node.attrs;

  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string): string | null => {
    if (!url) return null;

    // Handle youtube.com/watch?v=ID format
    const watchMatch = url.match(/youtube\.com\/watch\?v=([^&\s]+)/);
    if (watchMatch) return watchMatch[1];

    // Handle youtu.be/ID format
    const shortMatch = url.match(/youtu\.be\/([^?\s]+)/);
    if (shortMatch) return shortMatch[1];

    // Handle youtube.com/embed/ID format
    const embedMatch = url.match(/youtube\.com\/embed\/([^?\s]+)/);
    if (embedMatch) return embedMatch[1];

    return null;
  };

  const videoId = getVideoId(src);

  if (!videoId) {
    return (
      <NodeViewWrapper className="youtube-wrapper">
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 text-center text-gray-500">
          Invalid YouTube URL
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="youtube-wrapper">
      <div
        className="youtube-embed relative rounded-lg overflow-hidden my-4"
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            position: "relative",
            paddingBottom: "56.25%", // 16:9 aspect ratio
            height: 0,
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
          />
        </div>
      </div>
    </NodeViewWrapper>
  );
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtube: {
      setYoutubeVideo: (options: { src: string; width?: number; height?: number }) => ReturnType;
    };
  }
}

export const YoutubeExtension = Node.create<YoutubeOptions>({
  name: "youtube",

  group: "block",

  atom: true,
  draggable: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: "youtube-node",
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: 640,
      },
      height: {
        default: 480,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div.youtube-embed",
      },
      {
        tag: "iframe",
        getAttrs: (node) => {
          const element = node as HTMLElement;
          const src = element.getAttribute("src") || "";
          // Check if it's a YouTube embed
          if (src.includes("youtube.com/embed/")) {
            return {
              src: src,
              width: element.getAttribute("width") || 640,
              height: element.getAttribute("height") || 480,
            };
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { src, width = 640, height = 480 } = HTMLAttributes;

    // Extract video ID
    let videoId = "";
    const watchMatch = src?.match(/youtube\.com\/watch\?v=([^&\s]+)/);
    const shortMatch = src?.match(/youtu\.be\/([^?\s]+)/);
    const embedMatch = src?.match(/youtube\.com\/embed\/([^?\s]+)/);

    if (watchMatch) videoId = watchMatch[1];
    else if (shortMatch) videoId = shortMatch[1];
    else if (embedMatch) videoId = embedMatch[1];

    if (!videoId) {
      return ["div", { class: "youtube-embed" }, "Invalid YouTube URL"];
    }

    return [
      "div",
      {
        class: "youtube-embed",
        style: `width: ${width}px; max-width: 100%; margin: 0 auto;`,
      },
      [
        "iframe",
        mergeAttributes({
          src: `https://www.youtube.com/embed/${videoId}`,
          width: "100%",
          height: height,
          frameborder: "0",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowfullscreen: "true",
        }),
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YoutubeComponent);
  },

  addCommands() {
    return {
      setYoutubeVideo:
        ({ src, width = 640, height = 480 }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "youtube",
            attrs: { src, width, height },
          });
        },
    };
  },
});

export default YoutubeExtension;
