/**
 * i18n utilities for Astro's built-in i18n routing
 */

import { getCategoryDisplayName as getCategoryDisplayNameFromCategories } from './categories';

/**
 * Get category display name using locale
 */
export function getCategoryDisplayName(categorySlug: string, locale: string = 'en'): string {
  return getCategoryDisplayNameFromCategories(categorySlug, locale as any);
}

/**
 * Get current locale from Astro
 * This should be called from Astro pages/components
 */
export function getCurrentLocale(): string {
  // This will be available in Astro context
  return 'en'; // Default, will be overridden by Astro.locale
}

/**
 * Get localized URL path
 */
export function getLocalizedPath(path: string, locale: string, defaultLocale: string = 'en'): string {
  // If it's the default locale and prefixDefaultLocale is false, return path as-is
  if (locale === defaultLocale) {
    return path;
  }
  // Otherwise, prefix with locale
  return `/${locale}${path}`;
}

/**
 * Builds a URL with optional locale prefix, query parameters, and hash
 * @param path - The base path (e.g., '/skills', '/skills/calculator')
 * @param options - Optional configuration
 * @param options.locale - Locale code to prefix the path (e.g., 'en', 'vi', 'fr')
 * @param options.params - Query parameters as an object (e.g., { utm_source: 'home', filter: 'featured' })
 * @param options.hash - URL hash/anchor (e.g., 'overview')
 * @param options.preserveParams - If true, preserves existing query params in the path
 * @returns A formatted URL with optional locale prefix, query params, and hash
 * 
 * @example
 * buildUrl('/skills') // '/skills'
 * buildUrl('/skills', { locale: 'en' }) // '/en/skills'
 * buildUrl('/skills', { params: { filter: 'featured' } }) // '/skills?filter=featured'
 * buildUrl('/skills', { locale: 'en', params: { filter: 'featured' } }) // '/en/skills?filter=featured'
 */
export function buildUrl(
  path: string,
  options?: {
    locale?: string;
    params?: Record<string, string | number | boolean | null | undefined>;
    hash?: string;
    preserveParams?: boolean;
  }
): string {
  // Ensure path starts with a slash
  let normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Split path and existing query/hash
  const [pathOnly, existingQuery] = normalizedPath.split('?');
  const [pathWithoutHash, existingHash] = (existingQuery || pathOnly).includes('#') 
    ? normalizedPath.split('#') 
    : [pathOnly, ''];
  
  // Build the base path with optional locale prefix
  let url = options?.locale 
    ? `/${options.locale}${pathWithoutHash.split('?')[0]}`
    : pathWithoutHash.split('?')[0];
  
  // Handle query parameters
  const searchParams = new URLSearchParams();
  
  // Preserve existing params if needed
  if (options?.preserveParams && existingQuery) {
    const existingParams = new URLSearchParams(existingQuery.split('#')[0]);
    existingParams.forEach((value, key) => {
      searchParams.set(key, value);
    });
  }
  
  // Add new params
  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.set(key, String(value));
      }
    });
  }
  
  // Append query string if params exist
  const queryString = searchParams.toString();
  if (queryString) {
    url += `?${queryString}`;
  }
  
  // Handle hash/anchor
  const hash = options?.hash || existingHash;
  if (hash) {
    url += `#${hash.replace(/^#/, '')}`; // Remove leading # if present
  }
  
  return url;
}
