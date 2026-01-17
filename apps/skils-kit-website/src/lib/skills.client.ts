/**
 * Client-side utilities for loading language-specific search mappings
 * from public/data/ directory
 * 
 * These are fetched at runtime and can be language-specific,
 * while src/data/ files are used for SSR/build-time direct imports
 */

import { getLocale } from '@/paraglide/runtime'

export interface SearchMapping {
  tags: Record<string, { count: number; skills: Array<string> }>
  categories: Record<string, { count: number; skills: Array<string> }>
  skills: Record<string, { name: string; description: string; category?: string; tags: Array<string> }>
}

// Cache for loaded mappings per language
const mappingCache = new Map<string, SearchMapping>()

/**
 * Get the current locale, defaulting to 'en'
 */
function getCurrentLocale(): string {
  try {
    return getLocale() || 'en'
  } catch {
    return 'en'
  }
}

/**
 * Load language-specific search mapping from public/data/
 * Falls back to default mapping if language-specific one doesn't exist
 */
export async function loadLanguageSpecificMapping(
  locale?: string
): Promise<SearchMapping> {
  const lang = locale || getCurrentLocale()
  
  // Check cache first
  if (mappingCache.has(lang)) {
    return mappingCache.get(lang)!
  }
  
  try {
    // Try to load language-specific mapping
    const response = await fetch(`/data/search-mapping.${lang}.json`)
    if (response.ok) {
      const mapping = await response.json() as SearchMapping
      mappingCache.set(lang, mapping)
      return mapping
    }
  } catch (error) {
    console.warn(`Failed to load language-specific mapping for ${lang}:`, error)
  }
  
  // Fallback to default mapping
  try {
    const response = await fetch('/data/search-mapping.json')
    if (response.ok) {
      const mapping = await response.json() as SearchMapping
      mappingCache.set(lang, mapping)
      return mapping
    }
  } catch (error) {
    console.error('Failed to load default search mapping:', error)
  }
  
  // Return empty mapping as last resort
  return {
    tags: {},
    categories: {},
    skills: {},
  }
}

/**
 * Get categories from language-specific mapping (client-side)
 */
export async function getCategoriesFromMapping(
  locale?: string
): Promise<Array<string>> {
  const mapping = await loadLanguageSpecificMapping(locale)
  return Object.keys(mapping.categories).sort()
}

/**
 * Get tags from language-specific mapping (client-side)
 */
export async function getAllTagsFromMapping(
  locale?: string
): Promise<Array<string>> {
  const mapping = await loadLanguageSpecificMapping(locale)
  return Object.keys(mapping.tags).sort()
}

/**
 * Preload search mapping for a specific locale
 * Useful for prefetching when language changes
 */
export async function preloadSearchMapping(locale: string): Promise<void> {
  if (!mappingCache.has(locale)) {
    await loadLanguageSpecificMapping(locale)
  }
}
