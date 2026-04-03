import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';

export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://raksha.design',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), mdx()],
  redirects: {
    '/portfolio': '/',
  },
});
