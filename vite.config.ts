import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
    hmr: {
      clientPort: 5000,
      host: 'localhost'
    },
    proxy: {
      '/brief': 'http://localhost:3001',
      '/objections': 'http://localhost:3001',
      '/icp': 'http://localhost:3001',
      '/battlecard': 'http://localhost:3001',
      '/api': 'http://localhost:3001'
    }
  }
})
