import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "tailwindcss"
export default defineConfig({
  plugins: [react(),tailwindcss()],
  build: {
    outDir: "dist", // Output build to a 'dist' folder
  },
  server: {
    port: 3000,  
    host: true,
  },
   resolve: {
    alias: {
      '@': '/src',
    },
  }
})
