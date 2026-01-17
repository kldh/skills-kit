/**
 * Maps category slugs to Paraglide message keys
 * This utility converts category slugs (e.g., "pet-care") to translation keys (e.g., "category_petCare")
 */
export function getCategoryTranslationKey(categorySlug: string): string {
  const slugToKey: Record<string, string> = {
    'math': 'category_math',
    'reactjs': 'category_reactjs',
    'pet-care': 'category_petCare',
    'utility': 'category_utility',
    'example': 'category_example',
    'demo': 'category_demo',
  }
  
  return slugToKey[categorySlug] || `category_${categorySlug.replace(/-/g, '')}`
}
