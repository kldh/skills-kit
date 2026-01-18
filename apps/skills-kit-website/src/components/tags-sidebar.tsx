import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { getCategoryDisplayName } from '@/lib/i18n'
import { deLocalizeHref } from '@/paraglide/runtime'
import * as m from '@/paraglide/messages'

interface TagsSidebarProps {
  categories: Array<string>
  tags: Array<string>
  currentCategory?: string
  currentTag?: string
  className?: string
}

export function TagsSidebar({ categories, tags, currentCategory, currentTag, className }: TagsSidebarProps) {

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
              {m.categories_title()}
            </div>
            <div className="space-y-1">
              <Link
                to="/skills"
                search={currentTag ? { tag: currentTag } : {}}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  !currentCategory
                    ? 'bg-primary/10 text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {m.categories_all()}
              </Link>
              {categories.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {m.no_categories()}
                </div>
              ) : (
                categories.map((category) => {
                  const isActive = currentCategory === category
                  const displayName = getCategoryDisplayName(category)

                  return (
                    <Link
                      key={category}
                      to="/skills"
                      search={currentTag ? { category, tag: currentTag } : { category }}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-primary/10 text-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <span className="truncate">{displayName}</span>
                    </Link>
                  )
                })
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <div className="text-base font-semibold text-black uppercase tracking-wider mb-3 px-3">
              {m.tags_title()}
            </div>
            <div className="space-y-1">
              {tags.length === 0 ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {m.no_tags()}
                </div>
              ) : (
                tags.map((tag) => {
                  const isActive = currentTag === tag

                  return (
                    <Link
                      key={tag}
                      to="/skills"
                      search={currentCategory ? { category: currentCategory, tag } : { tag }}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-primary/10 text-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      <span className="truncate">{tag}</span>
                    </Link>
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
