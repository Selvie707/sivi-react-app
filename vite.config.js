import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://via707-sivi.hf.space',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
