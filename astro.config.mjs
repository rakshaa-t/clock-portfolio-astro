import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://raksha.design',
  output: 'static',
  adapter: vercel(),
  integrations: [react()],
  redirects: {
    '/portfolio': '/',
  },
});
