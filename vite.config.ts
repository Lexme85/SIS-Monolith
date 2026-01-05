
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Ermöglicht den Zugriff auf process.env.API_KEY im Browser
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  server: {
    port: 3000,
    strictPort: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
