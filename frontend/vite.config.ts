import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@mui") || id.includes("@emotion")) return "mui-vendor";
            if (id.includes("react-router") || id.includes("history")) return "router-vendor";
            if (id.includes("recharts")) return "charts-vendor";
            return "vendor";
          }
          return undefined;
        }
      }
    }
  }
})
