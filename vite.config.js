import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/nominatim': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/nominatim/, ''),
        headers: {
          // Nominatim wymaga jawnego UA z kontaktem
          'User-Agent': 'lokalna-platforma/1.0 (contact: wrx81906@student.wroclaw.merito.pl.com)',
          'Accept': 'application/json'
        }
      }
    }
  }
})
