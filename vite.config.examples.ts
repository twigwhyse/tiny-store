import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'examples',
  resolve: {
    alias: {
      '@eoyo/tiny-store': path.resolve(__dirname, 'src/index.ts')
    }
  },
  server: {
    port: 3000
  },
  build: {
    outDir: '../dist-examples'
  }
})
