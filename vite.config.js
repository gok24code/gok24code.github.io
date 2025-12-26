import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react({
    // Allow JSX syntax in .js files
    include: '**/*.{js,jsx,ts,tsx}',
  })],
})
