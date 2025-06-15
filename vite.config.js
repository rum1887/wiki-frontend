import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    port: process.env.PORT || 5173,
    allowedHosts: [
      'localhost',
      'wiki-tagging-frontend.onrender.com',
      'wiki-frontend-4ab7.onrender.com'
    ]
  },
  server: {
    host: true,
    port: 5173
  }
})
