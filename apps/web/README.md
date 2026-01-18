# Skills Kit Website (Astro)

This is the Astro version of the Skills Kit website, fully static with no client-side JavaScript.

## Features

- **Astro** - Full static site generation (SSG)
- **Zero JavaScript** - 100% static HTML/CSS (no client-side hydration)
- **Astro i18n** - Built-in internationalization with support for 7 languages
- **Tailwind CSS** - Utility-first CSS framework
- **Skills Gallery** - Browse and explore skills
- **Skill Details** - View detailed skill information
- **Server-side Filtering** - Filter skills by category and tags (static pages)

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The site will be available at `http://localhost:4321`

### Build

```bash
pnpm build
```

### Preview

```bash
pnpm preview
```

## Project Structure

```
src/
  components/     # React components
  layouts/        # Astro layouts
  lib/            # Utility functions and helpers
  pages/          # Astro pages (routes)
  data/           # Static data files
  styles.css      # Global styles
public/
  data/           # Public data files (language-specific mappings)
```

## Internationalization

The project uses **Astro's built-in i18n routing** with support for:
- English (en) - Default locale
- Spanish (es)
- French (fr)
- German (de)
- Japanese (ja)
- Chinese (zh)
- Vietnamese (vi)

### How it works

Astro automatically creates locale-specific routes:
- `/` - English (default locale, no prefix)
- `/es/` - Spanish
- `/fr/` - French
- `/de/` - German
- `/ja/` - Japanese
- `/zh/` - Chinese
- `/vi/` - Vietnamese

The `LanguageSwitcher` component in the header allows users to switch between languages. Translations are managed in `src/lib/i18n/messages.ts`.

### Configuration

i18n is configured in `astro.config.mjs`:
```javascript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'vi'],
  routing: {
    prefixDefaultLocale: false, // English routes don't have /en/ prefix
  },
}
```

## Architecture

This is a **fully static** site:
- All pages are pre-rendered at build time
- No client-side JavaScript or hydration
- All filtering and navigation is done via static HTML links
- Extremely fast page loads and perfect Lighthouse scores

## Migration Notes

This project was migrated from TanStack Start to Astro. Key changes:
- TanStack Router → Astro's file-based routing
- React components → Pure Astro components
- Client-side filtering → Server-side static page generation
- **Astro's built-in i18n** used for internationalization
- Zero JavaScript bundle (fully static HTML/CSS)
