import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", 
    port: 5173, 
    strictPort: true, 
    cors: {
      origin: ["https://7a15-202-164-149-48.ngrok-free.app"], 
      credentials: true, 
    },
    allowedHosts: [
      "7a15-202-164-149-48.ngrok-free.app" // Add the allowed Ngrok URL here
    ],
  }
})
 
