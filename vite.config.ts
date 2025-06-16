import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: process.env.NODE_ENV === 'development'
      ? {
          '/api': {
            target: 'https://lendbit-backend-staging.up.railway.app',
            changeOrigin: true,
            secure: false,
          },
        }
      : {},
  },
});