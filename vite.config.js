import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'

const sha = (() => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'dev'
  }
})()

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  define: {
    __BUILD_SHA__: JSON.stringify(sha),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
