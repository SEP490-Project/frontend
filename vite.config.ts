import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: {
    port: 3000,
  },
  css: {
    devSourcemap: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{ico,png,svg,webp}"],
      },
      manifest: {
        name: "Sales Orders",
        short_name: "Sales Orders",
        description: "Update and manage sales orders for Staff",
        start_url: "/sales-app",
        scope: "/sales-app",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "icon.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    tsconfigPaths({
      projects: ["./tsconfig.app.json"],
    }),
    tailwindcss(),
  ],
  preview: {
    allowedHosts: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // --- 1. HEAVY SPECIFIC LIBS (Check these FIRST) ---

            // PDF Generation (Very heavy, usually 1MB+)
            if (
              id.includes("@react-pdf") ||
              id.includes("pdfkit") ||
              id.includes("fontkit") ||
              id.includes("png-js")
            ) {
              return "pdf-vendor";
            }

            // Video Player
            if (id.includes("hls.js") || id.includes("plyr")) {
              return "video-vendor";
            }

            // Text Editor
            if (id.includes("@tiptap") || id.includes("prosemirror") || id.includes("lowlight")) {
              return "editor-vendor";
            }

            // Charts
            if (id.includes("recharts") || id.includes("d3") || id.includes("victory")) {
              return "charts-vendor";
            }

            // Excel / File Processing
            if (id.includes("xlsx") || id.includes("exceljs") || id.includes("crypto-js")) {
              return "file-proc-vendor";
            }

            // --- 2. GENERIC LIBS (Check these LAST) ---

            // React Core (Stable, small)
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router-dom") ||
              id.includes("redux")
            ) {
              return "react-vendor";
            }

            // UI Libraries
            if (
              id.includes("@radix-ui") ||
              id.includes("framer-motion") ||
              id.includes("lucide") ||
              id.includes("clsx") ||
              id.includes("tailwind")
            ) {
              return "ui-vendor";
            }

            // Utilities
            if (id.includes("axios") || id.includes("date-fns") || id.includes("lodash")) {
              return "utils-vendor";
            }

            // Anything else left over
            return "vendor-misc";
          }
        },
      },
    },
  },
});
