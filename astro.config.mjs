import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://cognis11.xyz',
  // Custom-domain hosting uses "/". A GitHub project preview can set
  // ASTRO_BASE_PATH=/repository-name without changing source links.
  base: process.env.ASTRO_BASE_PATH || '/',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
