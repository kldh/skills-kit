/**
 * React hook for loading language-specific search mappings
 * Uses public/data/ files for client-side language-aware data loading
 */

import { useEffect, useState } from 'react'
import {
  
  loadLanguageSpecificMapping,
  preloadSearchMapping
} from '../skills.client'
import type {SearchMapping} from '../skills.client';
import { getLocale } from '@/paraglide/runtime'

interface UseLanguageMappingResult {
  mapping: SearchMapping | null
  loading: boolean
  error: Error | null
  categories: Array<string>
  tags: Array<string>
}

/**
 * Hook to load language-specific search mapping
 * Automatically reloads when locale changes
 */
export function useLanguageMapping(): UseLanguageMappingResult {
  const [mapping, setMapping] = useState<SearchMapping | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [locale, setLocale] = useState<string>(() => {
    try {
      return getLocale() || 'en'
    } catch {
      return 'en'
    }
  })

  useEffect(() => {
    // Update locale when it changes
    const updateLocale = () => {
      try {
        const currentLocale = getLocale() || 'en'
        if (currentLocale !== locale) {
          setLocale(currentLocale)
        }
      } catch {
        // Ignore errors
      }
    }

    // Check locale periodically (Paraglide doesn't have a change event)
    const interval = setInterval(updateLocale, 100)
    
    return () => clearInterval(interval)
  }, [locale])

  useEffect(() => {
    let cancelled = false

    async function loadMapping() {
      setLoading(true)
      setError(null)

      try {
        const loadedMapping = await loadLanguageSpecificMapping(locale)
        if (!cancelled) {
          setMapping(loadedMapping)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load mapping'))
          setLoading(false)
        }
      }
    }

    loadMapping()

    return () => {
      cancelled = true
    }
  }, [locale])

  const categories = mapping ? Object.keys(mapping.categories).sort() : []
  const tags = mapping ? Object.keys(mapping.tags).sort() : []

  return {
    mapping,
    loading,
    error,
    categories,
    tags,
  }
}

/**
 * Preload search mapping for a locale
 * Useful for prefetching when language is about to change
 */
export function usePreloadLanguageMapping() {
  return {
    preload: (locale: string) => preloadSearchMapping(locale),
  }
}
