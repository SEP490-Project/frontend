import React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import PlyrPlayer from "@/components/global/PlyrPlayer";

interface VideoComponentProps {
  node: {
    attrs: {
      src: string;
      width: string;
    };
  };
  updateAttributes: (attrs: { width: string }) => void;
}

const VideoComponent: React.FC<VideoComponentProps> = ({ node }) => {
  const { src, width } = node.attrs;

  return (
    <NodeViewWrapper className="video-component-wrapper">
      <div className="relative rounded-md overflow-hidden border border-muted shadow-sm">
        <PlyrPlayer src={src} width={width} />
      </div>
    </NodeViewWrapper>
  );
};

export default VideoComponent;
