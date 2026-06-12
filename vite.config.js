import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@engine': path.resolve(__dirname, './src/egxOntologyEngine.js'),
      '@xai': path.resolve(__dirname, './src/egxXAIComponents.jsx'),
    },
  },
})