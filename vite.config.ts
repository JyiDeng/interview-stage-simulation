import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@met4citizen/talkinghead"]
  },
  server: {
    host: "0.0.0.0",
    port: 4173
  }
});
