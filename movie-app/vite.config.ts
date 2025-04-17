import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/MovieWebsite",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["Atium.png"],
      manifest: {
        name: "Movie Webiste",
        short_name: "MovieApp",
        description: "An app to keep track of movies you want to watch",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "Atium.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "Atium.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "Atium.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "dist",
  },
});
