import React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import PlyrPlayer from "@/components/global/PlyrPlayer";

const VideoComponent: React.FC<NodeViewProps> = ({ node }) => {
  const src = node.attrs.src as string;
  const width = node.attrs.width as string;

  return (
    <NodeViewWrapper className="video-component-wrapper">
      <div className="relative rounded-md overflow-hidden border border-muted shadow-sm">
        <PlyrPlayer src={src} width={width} />
      </div>
    </NodeViewWrapper>
  );
};

export default VideoComponent;
