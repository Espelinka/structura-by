import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Stringify the API key to ensure it's embedded as a string literal in the build
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    // Prevent "process is not defined" errors in browser if other libs access it
    'process.env': {}
  }
})