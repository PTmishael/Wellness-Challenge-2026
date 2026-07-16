import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // If deploying the static build under a sub-path (GitHub Pages),
  // change base to '/your-repo-name/'. Note: the AI coach needs the
  // Node server, so plain static hosting disables that one feature.
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5173,
    open: true,
    // In dev, forward /api/* to the Express server (npm run dev starts both).
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
