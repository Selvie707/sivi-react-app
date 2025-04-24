import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://d5b1-34-125-144-74.ngrok-free.app/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
