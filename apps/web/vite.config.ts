import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3000',
      '/contacts': 'http://localhost:3000',
      '/companies': 'http://localhost:3000',
      '/deals': 'http://localhost:3000',
      '/tasks': 'http://localhost:3000',
      '/notes': 'http://localhost:3000',
      '/activities': 'http://localhost:3000',
      '/tags': 'http://localhost:3000',
      '/users': 'http://localhost:3000',
    },
  },
})
