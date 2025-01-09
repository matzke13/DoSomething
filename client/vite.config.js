import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import { VitePWA } from 'vite-plugin-pwa';
import manifest from './manifest.js'


export default defineConfig({
  server: {
    port: 8080,
    proxy: {
      '/test': 'http://localhost:3000/',
    },
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),

    VitePWA({
      manifest,
      includeAssets: ['**/*.{js, css, html, ico, jpg, png, svg, ttf, jpeg}'],
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'custom-service-worker.js',
    }),
 
    quasar({
      sassVariables: '/src/quasar-variables.sass',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
