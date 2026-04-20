import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  site: 'https://arefafzali.github.io',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
});
