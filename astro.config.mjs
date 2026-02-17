import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  devToolbar: { enabled: false },
  site: 'https://raksha.design',
  output: 'static',
  adapter: vercel(),
});
