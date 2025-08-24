import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

//const BASE_URL = process.env.VITE_API_BASE_URL

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // Ensure correct forwarding
      },
    },
  },
});
