import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://arefafzali.github.io',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    resolve: {
      alias: { '@': '/src' }
    }
  }
});
