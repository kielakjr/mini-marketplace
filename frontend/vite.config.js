import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://api:3000', // Nazwa serwisu z docker-compose
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Usuwa '/api' przed wysłaniem do backendu
      },
    },
  },
})
