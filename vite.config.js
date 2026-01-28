import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
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
