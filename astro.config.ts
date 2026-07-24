import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://mdkalenderoglu.github.io',
  base: '/GeneSite',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
  output: 'static',
  trailingSlash: 'always',
});
