import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   "/api/v1":"http://localhost:8000",
  // },
  plugins: [
    tailwindcss(),
  ],
})
