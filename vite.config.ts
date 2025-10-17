import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://hoshi-vibe-site.somee.com',
        changeOrigin: true,
        // rewrite: path => path.replace(/^\/api/, '/api') // giữ nguyên
      }
    }
  }
})
