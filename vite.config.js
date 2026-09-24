import path from "node:path";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
});

// Note: no manualChunks. GSAP and Lenis are already behind dynamic imports
// (src/lib/motion.js, src/hooks/useLenis.jsx), so they split out on their own
// and never reach the entry chunk. Vite 8's Rolldown bundler also only accepts
// a function here, not the object form.
