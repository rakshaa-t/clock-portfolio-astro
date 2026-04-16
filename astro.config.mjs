import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://raksha.design',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), mdx(), sitemap()],
  redirects: {
    '/portfolio': '/',
  },
});
