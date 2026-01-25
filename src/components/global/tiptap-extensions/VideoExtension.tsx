import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import VideoComponent from "./VideoComponent";

export interface VideoOptions {
  allowFullscreen: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    video: {
      setVideo: (options: { src: string; width?: string | number }) => ReturnType;
    };
  }
}

export const VideoExtension = Node.create<VideoOptions>({
  name: "video",

  group: "block",

  atom: true,
  draggable: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: "video-node",
      },
    };
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: "100%",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "video",
        getAttrs: (node) => {
          const element = node as HTMLElement;
          // Try to find width on the parent wrapper if it exists, otherwise use default
          const wrapperWidth = element
            .closest("div[data-video-wrapper]")
            ?.getAttribute("style")
            ?.match(/width:\s*([^;]+)/)?.[1];

          return {
            src: element.getAttribute("src"),
            width: wrapperWidth || element.style.width || "100%",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { width, ...attributes } = HTMLAttributes;

    return [
      "div",
      {
        class: "video-wrapper",
        style: `width: ${width || "100%"}; margin: 0 auto;`,
      },
      [
        "video",
        mergeAttributes(attributes, {
          controls: "true",
          class: "js-hls-video w-full h-auto",
          style: "width: 100%",
        }),
      ],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoComponent);
  },

  addCommands() {
    return {
      setVideo:
        ({ src, width = "100%" }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "video",
            attrs: { src, width },
          });
        },
    };
  },
});
