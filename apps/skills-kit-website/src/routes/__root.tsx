import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import { GlobalHeader } from '../components/global-header'
import { getLocale } from '@/paraglide/runtime'

export const Route = createRootRoute({
  // i18n handled by Paraglide URL strategy + router URL rewriting
  // See: https://github.com/TanStack/router/tree/main/examples/react/start-i18n-paraglide
  head: () => {
    return {
      meta: [
        {
          charSet: 'utf-8',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          title: 'Skills Kit',
        },
      ],
      links: [
        {
          rel: 'stylesheet',
          href: appCss,
        },
      ],
    }
  },

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  // Paraglide's URL strategy automatically detects locale from URL
  // getLocale() returns the current locale based on configured strategies
  const lang = getLocale()
  
  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <GlobalHeader />
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
