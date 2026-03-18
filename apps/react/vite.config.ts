import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  server: {
    port: 5173,
  },
  /* ADD THIS SECTION BELOW */
  test: {
    globals: true,           // Allows using 'describe', 'it', 'expect' without imports
    environment: 'jsdom',    // Fixes the "document is not defined" error
    setupFiles: './src/setupTests.ts', // Connects the custom matchers
    coverage: {
      provider: 'v8',        // Required for the 5% Coverage grade
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx'], // Tracks everything in src
      exclude: ['src/main.tsx', 'src/vite-env.d.ts'], // Exclude entry points
    },
  },
})