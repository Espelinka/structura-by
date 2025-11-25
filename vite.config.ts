import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // specific replacement for the API Key to work in browser
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    // fallback for other process.env accesses
    'process.env': {} 
  }
})