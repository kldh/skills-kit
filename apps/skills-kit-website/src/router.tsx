import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { deLocalizeUrl, localizeUrl } from '@/paraglide/runtime'

// Create a new router instance
// Using Paraglide's URL rewriting functions following TanStack Start i18n-paraglide example
// See: https://github.com/TanStack/router/tree/main/examples/react/start-i18n-paraglide
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // URL rewriting for i18n following TanStack Start pattern
    // - input: strips locale prefix so router can match canonical routes
    // - output: adds locale prefix to generated URLs
    rewrite: {
      // When matching URLs, remove the locale prefix to match the canonical route
      // Example: /es/skills → /skills (for route matching)
      input: ({ url }) => deLocalizeUrl(url),
      // When generating URLs, add the locale prefix based on current locale
      // Example: /skills → /es/skills (if current locale is 'es')
      output: ({ url }) => localizeUrl(url),
    },
  })

  return router
}
