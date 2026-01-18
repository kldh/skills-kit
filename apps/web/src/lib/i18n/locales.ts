/**
 * Centralized locale configuration
 * Add new locales here to automatically generate routes
 */

export const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh', 'vi'] as const
export const defaultLocale = 'en'

export type Locale = typeof locales[number]

/**
 * Get all locales (for dynamic routes)
 * Now returns ALL locales including English
 */
export function getAllLocales(): string[] {
  return [...locales]
}

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
