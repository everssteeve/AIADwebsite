// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
// import sitemap from '@astrojs/sitemap' // Désactivé temporairement

// https://astro.build/config
export default defineConfig({
  site: 'https://aiad.dev',
  integrations: [
    mdx(),
    tailwind(),
    // sitemap(), // À réactiver quand plus de pages seront créées
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@layouts': '/src/layouts',
        '@lib': '/src/lib',
        '@content': '/src/content',
      },
    },
  },
})
