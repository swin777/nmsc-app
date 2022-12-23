import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
        "/homepage": {
            target: "http://localhost:8080",
            rewrite: path => path.replace(/^\/homepage/, "homepage"),
            secure: false,
            changeOrigin: true
        },
    },
  },
})  