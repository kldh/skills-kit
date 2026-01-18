// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
  ],
  i18n: {
    defaultLocale: 'en',
    // Note: Keep this in sync with src/lib/i18n/locales.ts
    // To add a new language, update both this array and locales.ts
    locales: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'vi'],
    routing: {
      prefixDefaultLocale: true,  // All languages use /[locale]/ prefix
    },
  },
  vite: {
    plugins: [
      // @ts-ignore
      tailwindcss(),
    ],
    optimizeDeps: {
      exclude: ['@repo/skills-kit'],
    },
    ssr: {
      external: ['fs', 'path', 'url', 'util'],
      noExternal: [],
    },
  },
  output: 'static',
});
