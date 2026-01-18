# Data Files Usage Guide

This document explains when to use `src/data/` vs `public/data/` for skills and search mapping data.

## Overview

The build script (`scripts/generate-build-data.ts`) generates data files in two locations:

1. **`src/data/`** - For direct ES module imports (SSR/SSG)
2. **`public/data/`** - For static HTTP serving (client-side runtime)

## `src/data/` - Direct Imports (Recommended for SSR)

**Location:** `apps/skils-kit-website/src/data/`

**Files:**
- `skills.json` - Complete skills data with metadata
- `search-mapping.json` - Search index (tags, categories, skills)

**Usage:**
```typescript
import skillsData from '@/data/skills.json'
import searchMappingData from '@/data/search-mapping.json'
```

**When to use:**
- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG)
- ✅ Build-time data loading
- ✅ Route loaders in TanStack Router
- ✅ Both server and client code (bundled at build time)

**Benefits:**
- Bundled at build time (no runtime HTTP requests)
- Type-safe imports
- Works in SSR/SSG contexts
- Better performance (no fetch overhead)
- Universal (works everywhere)

**Example:**
```typescript
// ✅ Good for SSR/SSG
import { getAllSkills, getCategories } from '@/lib/skills.server'
```

## `public/data/` - Static HTTP Serving (Client-side)

**Location:** `apps/skils-kit-website/public/data/`

**Files:**
- `skills.json` - Skills data (same as src/data/)
- `search-mapping.json` - Default search mapping
- `search-mapping.{locale}.json` - Language-specific mappings (en, es, fr, de, ja, zh, vi)
- `route-manifest.json` - Route manifest for i18n

**Usage:**
```typescript
// Client-side fetch
const response = await fetch('/data/search-mapping.en.json')
const mapping = await response.json()
```

**When to use:**
- ✅ Client-side language switching
- ✅ Dynamic language-specific data loading
- ✅ Runtime language changes without page reload
- ✅ Prefetching data for language changes

**Benefits:**
- Language-specific mappings available
- Can be fetched dynamically
- Useful for client-side language switching
- Can be cached by browser/CDN

**Example:**
```typescript
// ✅ Good for client-side language-aware loading
import { useLanguageMapping } from '@/lib/hooks/use-language-mapping'

function MyComponent() {
  const { categories, tags, loading } = useLanguageMapping()
  // ...
}
```

## Current Implementation

### Server-side (SSR/SSG)
- **Route loaders** use `src/data/` via `@/lib/skills.server`
- Data is loaded at build time or server-side
- Works with `prerender: true` in TanStack Router

### Client-side (Optional)
- **Language switcher** prefetches mappings from `public/data/`
- **React hooks** available for dynamic language-aware loading
- Can be used for client-side updates without full page reload

## Migration Path

If you need client-side language-specific mappings:

1. **Use the hook:**
```typescript
import { useLanguageMapping } from '@/lib/hooks/use-language-mapping'

function MyComponent() {
  const { categories, tags } = useLanguageMapping()
  // Use categories/tags instead of props from loader
}
```

2. **Or use the client utilities:**
```typescript
import { getCategoriesFromMapping } from '@/lib/skills.client'

const categories = await getCategoriesFromMapping('es')
```

## Summary

| Feature | `src/data/` | `public/data/` |
|---------|-------------|----------------|
| **Import method** | ES module import | HTTP fetch |
| **Build time** | ✅ Bundled | ❌ Runtime |
| **SSR/SSG** | ✅ Works | ❌ Not ideal |
| **Type safety** | ✅ Yes | ⚠️ Manual typing |
| **Language-specific** | ❌ Single file | ✅ Per locale |
| **Performance** | ✅ Best | ⚠️ Network request |
| **Use case** | SSR, SSG, loaders | Client-side, i18n |

**Recommendation:** Use `src/data/` for SSR/SSG (current approach). Use `public/data/` only when you need client-side language-specific mappings or dynamic language switching without page reloads.
