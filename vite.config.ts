import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Tauri expects a fixed port
  server: {
    port: 5173,
    strictPort: true,
  },
  // Tauri uses dist as the build output directory
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
