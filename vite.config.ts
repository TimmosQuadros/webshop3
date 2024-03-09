import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true, // This enables global variables like `vi`
    setupFiles: ["./src/test/vitest.setup.ts"],
  },
});
