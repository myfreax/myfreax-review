import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import postcss from './postcss.config.js';

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
       '/comments': {
        target: 'http://127.0.0.1:8780',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/comments/, '')
      },
    }
  },
  css: {
    postcss,
  },
  plugins: [svelte({
    /* plugin options */
  })]
})
