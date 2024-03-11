import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/child-app-1/',
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 4002,
    host: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    // Allow services to be provided for non root directories of projects
    fs: {
      strict: false
    },
  }
})
