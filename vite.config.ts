import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

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
  ],
});
