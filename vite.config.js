import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true,
    proxy: {
      '/articles': { target: 'http://localhost:8000', changeOrigin: true },
      '/issues': { target: 'http://localhost:8000', changeOrigin: true },
      '/editors': { target: 'http://localhost:8000', changeOrigin: true },
      '/policies': { target: 'http://localhost:8000', changeOrigin: true },
      '/announcements': { target: 'http://localhost:8000', changeOrigin: true },
      '/settings': { target: 'http://localhost:8000', changeOrigin: true },
      '/hero-slides': { target: 'http://localhost:8000', changeOrigin: true },
      '/upload': { target: 'http://localhost:8000', changeOrigin: true },
      '/health': { target: 'http://localhost:8000', changeOrigin: true },
      '/authors': { target: 'http://localhost:8000', changeOrigin: true },
      '/reviews': { target: 'http://localhost:8000', changeOrigin: true },
      '/users': { target: 'http://localhost:8000', changeOrigin: true },
      '/contact-messages': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})