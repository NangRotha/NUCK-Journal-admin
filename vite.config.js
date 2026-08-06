import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // 🟢 ចាំបាច់សម្រាប់ Vercel
  build: {
    outDir: 'dist', // 🟢 ត្រូវប្រាកដថានេះគឺជា 'dist'
  },
  server: {
    port: 5174,
    open: true,
    // 🟢 យើងបានដក proxy ចេញទាំងស្រុង ព្រោះនៅលើ Vercel យើងមិនអាចប្រើ localhost បានទេ។
    // Frontend នឹងភ្ជាប់ទៅ Backend តាមរយៈ VITE_API_URL នៅក្នុង axiosConfig.js
  },
})