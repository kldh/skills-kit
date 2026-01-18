/**
 * i18n utilities using Paraglide
 * 
 * Paraglide generates translation functions in @/paraglide/messages
 * and runtime utilities in @/paraglide/runtime
 * 
 * Translations are embedded at build time for each language route
 */

import { getLocale } from '@/paraglide/runtime'
import { getCategoryTranslationKey } from './category-mapper'

// Import Paraglide messages (generated at build time by Paraglide plugin)
// This will be tree-shaken and embedded per language during static generation
// Paraglide generates messages per language, so each route gets the correct translations
let messages: Record<string, () => string> | null = null

// Try to load messages synchronously for SSR/build time
try {
  // @ts-expect-error - Paraglide messages are generated at build time
  const m = require('@/paraglide/messages')
  messages = m.default || m
} catch {
  // Messages not available yet (during initial build or if Paraglide hasn't run)
  messages = null
}

/**
 * Get category display name using Paraglide
 * Translations are embedded at build time based on the language route
 */
export function getCategoryDisplayName(categorySlug: string): string {
  try {
    const key = getCategoryTranslationKey(categorySlug)
    
    // Use Paraglide messages if available (embedded at build time)
    if (messages && typeof messages[key] === 'function') {
      return messages[key]()
    }
    
    // Try dynamic import for SSR/build time
    // @ts-expect-error - Paraglide messages are generated at build time
    const dynamicMessages = require('@/paraglide/messages')
    if (dynamicMessages && typeof dynamicMessages[key] === 'function') {
      return dynamicMessages[key]()
    }
  } catch {
    // Fallback if Paraglide is not available
  }
  
  // Fallback formatting
  return categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get current locale
 * Returns the current language tag from Paraglide, or 'en' as default
 * Language is set per route at build time
 */
export function getCurrentLocale(): string {
  try {
    return getLocale() || 'en'
  } catch {
    return 'en'
  }
}
