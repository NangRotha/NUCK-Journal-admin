import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5174,
    open: true,
    // 🟢 ដក proxy ចេញទាំងស្រុង ព្រោះនៅលើ Vercel មិនអាចប្រើ localhost បានទេ
  },
})