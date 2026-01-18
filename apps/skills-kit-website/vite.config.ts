import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { paraglideVitePlugin } from "@inlang/paraglide-js"
import { prepareBuildPlugin } from './vite-plugins/prepare-build'

const config = defineConfig({
  plugins: [
    // Paraglide must run before Nitro (which analyzes server.ts)
    // so that paraglide files are generated before Nitro tries to load server.ts
    paraglideVitePlugin({
      project: "./project.inlang",
      outdir: "./src/paraglide",
      // URL strategy configuration following TanStack Start example
      // See: https://inlang.com/m/gerre34r/library-inlang-paraglideJs/strategy
      strategy: ["url", "cookie", "baseLocale"],
    }),
    // Prepare build data (after paraglide so files exist)
    prepareBuildPlugin(),
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart({
      prerender: {
        // Enable prerendering
        enabled: true,

        // Enable if you need pages to be at `/page/index.html` instead of `/page.html`
        autoSubfolderIndex: true,

        // If disabled, only the root path or the paths defined in the pages config will be prerendered
        autoStaticPathsDiscovery: true,

        // How many prerender jobs to run at once
        concurrency: 14,

        // Whether to extract links from the HTML and prerender them also
        crawlLinks: true,

        // Filter function takes the page object and returns whether it should prerender
        filter: ({ path }: { path: string }) => !path.startsWith('/do-not-render-me'),

        // Number of times to retry a failed prerender job
        retryCount: 2,

        // Delay between retries in milliseconds
        retryDelay: 1000,

        // Maximum number of redirects to follow during prerendering
        maxRedirects: 5,

        // Fail if an error occurs during prerendering
        failOnError: true,

        // Callback when page is successfully rendered
        onSuccess: ({ page }: { page: any }) => {
          console.log(`Rendered ${page.path}!`)
        },
      },
    }),
    viteReact(),
  ],
  optimizeDeps: {
    // Exclude @repo/skills-kit from client-side pre-bundling
    // since it contains server-only code with Node.js fs module
    exclude: ['@repo/skills-kit'],
  },
  ssr: {
    // Externalize Node.js built-in modules for SSR
    external: ['fs', 'path', 'url', 'util'],
    // Mark @repo/skills-kit as external to prevent bundling Node.js code
    noExternal: [],
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Externalize Node.js built-in modules
        if (id === 'fs' || id === 'path' || id === 'url' || id === 'util' || id.startsWith('node:')) {
          return true;
        }
        return false;
      },
    },
  },
})

export default config
