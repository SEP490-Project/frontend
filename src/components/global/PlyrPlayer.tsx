"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

interface PlyrPlayerProps {
  src: string;
  className?: string;
  width?: string;
}

const PlyrPlayer: React.FC<PlyrPlayerProps> = ({ src, className, width }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // 1. Setup HLS if supported (Chrome/Firefox/Windows)
    if (Hls.isSupported() && src.endsWith(".m3u8")) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(src);

      // Wait for manifest to load quality levels
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableQualities = hls.levels.map((l) => l.height);
        availableQualities.unshift(0); // Add '0' for Auto

        // Initialize Plyr with quality controls
        playerRef.current = new Plyr(video, {
          quality: {
            default: 0,
            options: availableQualities,
            forced: true,
            onChange: (newQuality: number) => {
              if (newQuality === 0) {
                hls.currentLevel = -1; // Auto
              } else {
                // Find index of the selected height
                const levelIndex = hls.levels.findIndex((l) => l.height === newQuality);
                hls.currentLevel = levelIndex;
              }
            },
          },
          i18n: {
            qualityLabel: {
              0: "Auto",
            },
          },
        });
      });

      hls.attachMedia(video);
    } else {
      // 2. Native HLS (Safari) or Standard Video (mp4)
      video.src = src;
      playerRef.current = new Plyr(video);
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [src]);

  return (
    <div style={{ width: width || "100%" }} className={className}>
      <video
        ref={videoRef}
        className="plyr-react plyr"
        playsInline
        controls
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default PlyrPlayer;
