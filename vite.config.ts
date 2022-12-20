import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        "/server": {
            target: "https://localhost:8080",
            rewrite: path => path.replace(/^\/server/, ""),
            secure: false,
            changeOrigin: true
        },
    },
  },
})  