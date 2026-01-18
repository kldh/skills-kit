import handler from '@tanstack/react-start/server-entry'
// @ts-expect-error - Paraglide generates JS files without type declarations
import { paraglideMiddleware } from './paraglide/server.js'

export default {
  fetch(req: Request): Promise<Response> {
    // Use paraglideMiddleware for locale detection and AsyncLocalStorage context
    // Note: We pass the original `req` to handler.fetch() because TanStack Router
    // handles URL delocalization via its own rewrite API (deLocalizeUrl/localizeUrl)
    return paraglideMiddleware(req, () => handler.fetch(req))
  },
}
