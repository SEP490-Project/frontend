import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { PWAConfig } from "./src/libs/config";

export default defineConfig({
  server: {
    port: 3000,
  },
  css: {
    devSourcemap: true,
  },
  plugins: [
    react(),
    tsconfigPaths({
      projects: ["./tsconfig.app.json"],
    }),
    tailwindcss(),
    VitePWA(PWAConfig),
  ],
});
