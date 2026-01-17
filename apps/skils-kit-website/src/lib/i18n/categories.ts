/**
 * Category display name translations
 * Maps category slugs to human-readable display names
 */

export type Locale = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'vi'

export const categoryTranslations: Record<Locale, Record<string, string>> = {
  en: {
    'math': 'Math',
    'reactjs': 'React.js',
    'pet-care': 'Pet Care',
    'utility': 'Utility',
    'example': 'Example',
    'demo': 'Demo',
  },
  es: {
    'math': 'Matemáticas',
    'reactjs': 'React.js',
    'pet-care': 'Cuidado de Mascotas',
    'utility': 'Utilidad',
    'example': 'Ejemplo',
    'demo': 'Demostración',
  },
  fr: {
    'math': 'Mathématiques',
    'reactjs': 'React.js',
    'pet-care': 'Soins pour Animaux',
    'utility': 'Utilitaire',
    'example': 'Exemple',
    'demo': 'Démo',
  },
  de: {
    'math': 'Mathematik',
    'reactjs': 'React.js',
    'pet-care': 'Tierpflege',
    'utility': 'Dienstprogramm',
    'example': 'Beispiel',
    'demo': 'Demo',
  },
  ja: {
    'math': '数学',
    'reactjs': 'React.js',
    'pet-care': 'ペットケア',
    'utility': 'ユーティリティ',
    'example': '例',
    'demo': 'デモ',
  },
  zh: {
    'math': '数学',
    'reactjs': 'React.js',
    'pet-care': '宠物护理',
    'utility': '实用工具',
    'example': '示例',
    'demo': '演示',
  },
  vi: {
    'math': 'Toán học',
    'reactjs': 'React.js',
    'pet-care': 'Chăm sóc thú cưng',
    'utility': 'Tiện ích',
    'example': 'Ví dụ',
    'demo': 'Demo',
  },
}

/**
 * Get the display name for a category slug
 * Falls back to a formatted version of the slug if translation is not found
 */
export function getCategoryDisplayName(
  categorySlug: string,
  locale: Locale = 'en'
): string {
  const translation = categoryTranslations[locale]?.[categorySlug]
  
  if (translation) {
    return translation
  }
  
  // Fallback: format the slug to a readable name
  return categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get all category display names for a given locale
 */
export function getCategoryDisplayNames(locale: Locale = 'en'): Record<string, string> {
  return categoryTranslations[locale] || categoryTranslations.en
}
