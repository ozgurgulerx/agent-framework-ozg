import process from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiProxyEnv = typeof process !== 'undefined' ? process.env?.VITE_API_PROXY : undefined
const API_PROXY_TARGET = apiProxyEnv ?? 'http://127.0.0.1:8000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: API_PROXY_TARGET,
        changeOrigin: true
      }
    }
  }
})
