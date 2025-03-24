import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    hmr: mode === "production" ? false : true, // Disable HMR in production
  }
}));
