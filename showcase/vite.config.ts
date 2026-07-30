import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/** Standalone showcase lab — port 5180, separate from the portfolio on 5173. */
export default defineConfig({
  base: '/showcase/',
  plugins: [react()],
  build: {
    outDir: '../public/showcase',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5180,
    strictPort: true,
    open: '/',
  },
});
