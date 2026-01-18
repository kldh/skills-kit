# Internationalization (i18n) Guide

This guide explains how to add new languages to the Skills Kit website.

## Zero Code Duplication Architecture ✨

**All languages (including English) use the same `[locale]` routes.** This means:
- ✅ **No code duplication** - write features once, works for all languages
- ✅ **Easy maintenance** - update one file, affects all locales
- ✅ **Scalable** - add unlimited languages without creating new files

## Adding a New Language

To add a new language, you only need to update **2 files**:

### 1. Update `locales.ts`

Add your language code to the `locales` array in `src/lib/i18n/locales.ts`:

```typescript
export const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh', 'vi', 'pt', 'ko'] as const
//                                                                  ^^^^  ^^^^ Add new locales here
```

### 2. Update `astro.config.mjs`

Add the same language code to the `locales` array in `astro.config.mjs`:

```javascript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'vi', 'pt', 'ko'],
  //                                                  ^^^^  ^^^^ Add new locales here
  routing: {
    prefixDefaultLocale: true,  // All languages use /[locale]/ prefix
  },
},
```

### 3. Add Translations (Optional but Recommended)

Add translations for your language in these files:

#### `messages.ts`

Add a new object for your locale:

```typescript
const messages: Record<string, Record<string, string>> = {
  // ... existing languages ...
  pt: {
    header_skills_kit: 'Kit de Habilidades',
    header_explore: 'Explorar',
    header_trending: 'Tendências',
    header_docs: 'Documentação',
    // ... add all message keys
  },
}
```

#### `categories.ts`

Add translations for category names:

```typescript
const categoryTranslations: Record<string, Record<string, string>> = {
  // ... existing categories ...
  'ai-agents': {
    en: 'AI Agents',
    es: 'Agentes de IA',
    pt: 'Agentes de IA',
    // ... add for all categories
  },
}
```

#### `language-switcher-astro.tsx`

Add the language name display:

```typescript
const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  pt: 'Português',
  ko: '한국어',
  // ... add new languages
};
```

## How It Works

The i18n system uses **dynamic routing** with the `[locale]` parameter for **ALL languages**:

- **All languages**: `/en/`, `/es/`, `/fr/`, `/de/`, `/ja/`, `/zh/`, `/vi/`
- **All skills**: `/en/skills/`, `/es/skills/`, `/fr/skills/calculator/`
- **Root redirect**: `/` → `/en/` (automatic redirect to default locale)

### File Structure

```
src/pages/
├── index.astro              # Root redirect (/) → redirects to /en/
└── [locale]/                # 👈 ALL languages use this (including English!)
    ├── index.astro          # Homepage for ALL locales (/en/, /es/, /fr/, etc.)
    └── skills/
        ├── index.astro      # Skills gallery for ALL locales (/en/skills/, /es/skills/)
        └── [skillName].astro # Skill detail for ALL locales (/en/skills/calculator/)
```

**Key Point:** There are **only 3 page files** that handle **all languages and all routes**. No duplication!

### Dynamic Route Generation

The `getStaticPaths()` function in each `[locale]` route automatically generates pages for **ALL locales**:

```typescript
export function getStaticPaths() {
  return getAllLocales().map((locale) => ({
    params: { locale },
  }))
}
```

This means:
- **Zero code duplication** - English uses the same code as Spanish, French, etc.
- **Single source of truth** - one file handles all languages
- **Easy feature development** - add a feature once, it works for all languages
- **No need to create directories** - just update the locales array

## Language Switcher

The language switcher in the header automatically:
- Shows all available languages from the `locales` array
- Maintains the current path when switching (e.g., `/en/skills/calculator/` → `/es/skills/calculator/`)
- Intelligently replaces the locale prefix

## Benefits of This Approach

✅ **Zero Duplication**: English and all other languages share the exact same code  
✅ **Single Source of Truth**: Update one file, affects all languages  
✅ **Scalable**: Add unlimited languages without creating new files  
✅ **Maintainable**: All routes defined in 3 files only  
✅ **DRY**: No code duplication whatsoever  
✅ **Type-safe**: TypeScript ensures locale validity  
✅ **Automatic**: Routes generated at build time  
✅ **Consistent**: All languages have the exact same features and behavior

## Example: Adding Portuguese (pt) and Korean (ko)

1. Edit `src/lib/i18n/locales.ts`:
   ```typescript
   export const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh', 'vi', 'pt', 'ko'] as const
   ```

2. Edit `astro.config.mjs`:
   ```javascript
   locales: ['en', 'es', 'fr', 'de', 'ja', 'zh', 'vi', 'pt', 'ko'],
   ```

3. Add translations in `messages.ts`, `categories.ts`, and `language-switcher-astro.tsx`

4. Build:
   ```bash
   pnpm build
   ```

That's it! Your site now supports Portuguese and Korean. 🎉

The build will automatically generate:
- `/pt/` and `/ko/` (homepages)
- `/pt/skills/` and `/ko/skills/` (skills galleries)
- `/pt/skills/[skillName]/` and `/ko/skills/[skillName]/` (skill details)

## When You Add a Feature

When you add a new feature or component:

1. ✅ Edit the file in `src/pages/[locale]/` once
2. ✅ That's it! Feature works for **all 7 languages** (or however many you have)
3. ✅ No need to copy-paste to other language directories
4. ✅ No risk of forgetting to update a language version

**Example:** Adding a "Share" button:
- Before (with duplication): Edit 7+ files (one per language) ❌
- Now (with [locale]): Edit 1 file, works for all languages ✅
