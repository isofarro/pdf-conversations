import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      VITE_OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY, // Only expose this variable
    },
  }
})
