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
});
