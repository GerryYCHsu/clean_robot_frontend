import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 9487,
    proxy: {
      '/api': {
        target: 'http://tw100043939.corpnet.auo.com:19996',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') 
      }
    },
    watch: {
      usePolling: true,
    },
  },
})
