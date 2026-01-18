import {  clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type {ClassValue} from "clsx";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs))
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
 * buildUrl('/skills', { hash: 'top' }) // '/skills#top'
 * buildUrl('/skills', { locale: 'en', params: { utm_source: 'home' }, hash: 'top' }) // '/en/skills?utm_source=home#top'
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
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
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

/**
 * @deprecated Use buildUrl with { locale } option instead
 * Creates a localized URL path - legacy wrapper for backward compatibility
 */
export function getLocalePath(
  locale: string,
  path: string,
  options?: {
    params?: Record<string, string | number | boolean | null | undefined>;
    hash?: string;
    preserveParams?: boolean;
  }
): string {
  return buildUrl(path, { ...options, locale });
}
