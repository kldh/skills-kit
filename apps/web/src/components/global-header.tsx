import { HugeiconsIcon } from '@hugeicons/react'
import { Github01Icon } from '@hugeicons/core-free-icons'
import { LanguageSwitcher } from '@/components/language-switcher-astro'
import { t } from '@/lib/i18n/messages'
import { buildUrl } from '@/lib/utils'

interface GlobalHeaderProps {
  locale?: string;
  currentPath?: string;
}

export function GlobalHeader({ locale = 'en', currentPath = '/' }: GlobalHeaderProps) {
  return (
    <nav className="h-16 flex items-center justify-between px-6 border-b border-border bg-background sticky top-0 z-50">
      <a
        href={buildUrl('/', { locale })}
        className="text-foreground text-sm font-semibold tracking-tight hover:text-primary transition-colors"
      >
        {t('header_skills_kit', locale)}
      </a>
      <div className="flex items-center gap-6">
        <a
          href={buildUrl('/skills', { locale })}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {t('header_explore', locale)}
        </a>
        <a
          href={buildUrl('/skills', { locale })}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {t('header_trending', locale)}
        </a>
        <a
          href={buildUrl('/skills', { locale })}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {t('header_docs', locale)}
        </a>
        <a
          href="https://github.com/kldh/skills-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub repository"
        >
          <HugeiconsIcon icon={Github01Icon} className="size-5" />
        </a>
        <LanguageSwitcher currentLocale={locale} currentPath={currentPath} />
      </div>
    </nav>
  )
}
