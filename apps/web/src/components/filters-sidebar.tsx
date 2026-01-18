'use client'

import { useEffect, useState } from 'react'
import { cn, buildUrl } from '@/lib/utils'
import { getCategoryDisplayName } from '@/lib/i18n/astro'
import { t } from '@/lib/i18n/messages'

interface FiltersSidebarProps {
  categories: Array<string>
  tags: Array<string>
  currentCategory?: string
  currentTag?: string
  className?: string
  locale?: string
}

function getURLParams() {
  if (typeof window === 'undefined') return { category: undefined, tag: undefined }
  const params = new URLSearchParams(window.location.search)
  return {
    category: params.get('category') || undefined,
    tag: params.get('tag') || undefined,
  }
}

export function FiltersSidebar({ categories, tags, className, locale = 'en' }: FiltersSidebarProps) {
  // Read from URL on initial render (works for static sites)
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(() => getURLParams().category)
  const [currentTag, setCurrentTag] = useState<string | undefined>(() => getURLParams().tag)

  // Update when URL changes (back/forward navigation)
  useEffect(() => {
    const updateFromURL = () => {
      const { category, tag } = getURLParams()
      setCurrentCategory(category)
      setCurrentTag(tag)
    }
    
    window.addEventListener('popstate', updateFromURL)
    return () => window.removeEventListener('popstate', updateFromURL)
  }, [])
  
  return (
    <aside
      className={cn(
        'fixed left-0 top-16 bottom-0 w-64 border-r border-border bg-background overflow-y-auto',
        'hidden lg:block z-10',
        className
      )}
    >
      <div className="p-6">
        <nav className="space-y-8">


          {/* Categories Section */}
          <div>
            <div className="text-black text-base font-semibold uppercase tracking-wider mb-3">
              {t('categories_title', locale)}
            </div>
            <div className="space-y-1">
              <a
                href={buildUrl('/skills', { locale, params: currentTag ? { tag: currentTag } : undefined })}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  !currentCategory
                    ? 'bg-primary/10 text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {t('categories_all', locale)}
              </a>
              {categories.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {t('no_categories', locale)}
                </div>
              ) : (
                categories.map((category) => {
                  const isActive = currentCategory === category
                  const displayName = getCategoryDisplayName(category, locale)

                  const params: Record<string, string> = { category };
                  if (currentTag) params.tag = currentTag;

                  return (
                    <a
                      key={category}
                      href={buildUrl('/skills', { locale, params })}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-primary/10 text-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <span className="truncate">{displayName}</span>
                    </a>
                  )
                })
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <div className="text-base font-semibold text-black uppercase tracking-wider mb-3 px-3">
              {t('tags_title', locale)}
            </div>
            <div className="space-y-1">
              {tags.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {t('no_tags', locale)}
                </div>
              ) : (
                tags.map((tag) => {
                  const isActive = currentTag === tag

                  const params: Record<string, string> = { tag };
                  if (currentCategory) params.category = currentCategory;

                  return (
                    <a
                      key={tag}
                      href={buildUrl('/skills', { locale, params })}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-primary/10 text-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <span className="truncate">{tag}</span>
                    </a>
                  )
                })
              )}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  )
}
