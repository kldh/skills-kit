# Paraglide i18n Setup

This project uses Paraglide for i18n, following the pattern from [TanStack Router's i18n example](https://github.com/TanStack/router/tree/main/examples/react/start-i18n-paraglide).

## Installation

Run the following command to install Paraglide dependencies:

```bash
pnpm install @inlang/paraglide-js vite-plugin-paraglide
```

## Build Paraglide

After installation, run:

```bash
pnpm dev
```

This will generate Paraglide code in `src/lib/paraglide/` directory.

## Usage

Once Paraglide is set up, you can use translations like this:

```typescript
import * as m from '@/lib/paraglide/messages'
import { setLanguageTag, languageTag } from '@/lib/paraglide/runtime'

// Set language
setLanguageTag('en') // or 'es', 'fr', 'de', 'ja', 'zh'

// Use translations
const categoryName = m.category_math() // Returns "Math" in English
```

## Category Translations

Category slugs are mapped to translation keys:
- `"math"` → `m.category_math()`
- `"reactjs"` → `m.category_reactjs()`
- `"pet-care"` → `m.category_petCare()`
- etc.

Use `getCategoryTranslationKey()` from `@/lib/i18n` to get the translation key for a category slug.
