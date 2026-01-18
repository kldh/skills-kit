import { useEffect, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { TranslateIcon } from '@hugeicons/core-free-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  assertIsLocale,
  getLocale,
  locales,
  setLocale,
} from '@/paraglide/runtime.js'
import { usePreloadLanguageMapping } from '@/lib/hooks/use-language-mapping'

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  zh: '中文',
  vi: 'Tiếng Việt',
}

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<string>(getLocale())
  const { preload } = usePreloadLanguageMapping()

  useEffect(() => {
    setCurrentLocale(getLocale())
  }, [])

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale && newLocale !== currentLocale) {
      // Preload the language-specific mapping before switching
      preload(newLocale)
      
      // setLocale with reload: true will:
      // 1. Set the cookie (cookie strategy)
      // 2. Navigate to the localized URL (url strategy) 
      // 3. Reload the page to apply the changes
      setLocale(assertIsLocale(newLocale), { reload: true })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 h-8 w-[60px] text-xs bg-transparent text-muted-foreground hover:text-accent-foreground cursor-pointer uppercase px-2 py-1.5 rounded-none border border-input hover:bg-accent transition-colors"
      >
        {currentLocale}
        <HugeiconsIcon icon={TranslateIcon} className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {locales.map((locale: string) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <span>{languageNames[locale] || locale}</span>
              <span className="text-muted-foreground ml-2 text-[10px] uppercase">
                {locale}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
