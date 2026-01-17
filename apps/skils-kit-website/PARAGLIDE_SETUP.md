# Paraglide i18n Setup Guide

This project is configured to use [Paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) for i18n, following the pattern from [TanStack Router's i18n example](https://github.com/TanStack/router/tree/main/examples/react/start-i18n-paraglide).

## Installation Steps

1. **Install Paraglide dependencies:**
   ```bash
   pnpm install @inlang/paraglide-js vite-plugin-paraglide
   ```

2. **Run the dev server** (this will generate Paraglide code):
   ```bash
   pnpm dev
   ```

   Paraglide will automatically generate translation functions in `src/lib/paraglide/` during the build.

## Configuration Files

The following files have been created:

- `paraglide.config.json` - Paraglide configuration
- `project.inlang/settings.json` - Inlang project settings
- `project.inlang/messages/*.json` - Translation files for each language

## Supported Languages

- `en` - English (default)
- `es` - Spanish
- `fr` - French
- `de` - German
- `ja` - Japanese
- `zh` - Chinese

## Usage After Setup

Once Paraglide is installed and built, update `src/lib/i18n/index.ts`:

```typescript
import * as m from '../paraglide/messages'
import { setLanguageTag, languageTag } from '../paraglide/runtime'

// Set language
setLanguageTag('en') // or 'es', 'fr', etc.

// Use translations
const categoryName = m.category_math() // Returns "Math" in current language
```

## Category Translations

Category slugs are automatically mapped to translation keys:
- `"math"` → `m.category_math()`
- `"reactjs"` → `m.category_reactjs()`
- `"pet-care"` → `m.category_petCare()`

The `getCategoryDisplayName()` function in `src/lib/i18n/index.ts` handles this mapping automatically.

## Adding New Translations

1. Add the translation key to all language files in `project.inlang/messages/`
2. Run `pnpm dev` to regenerate Paraglide code
3. Use the new translation function in your components

## Integration with TanStack Router

To add locale support to routes, you can:

1. Add locale to route search params
2. Use `setLanguageTag()` in route loaders based on the locale param
3. Update links to include locale when navigating

Example:
```typescript
// In route loader
loader: ({ search }) => {
  const locale = search.locale || 'en'
  setLanguageTag(locale)
  // ... rest of loader
}
```
