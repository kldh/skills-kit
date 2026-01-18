import { HugeiconsIcon } from '@hugeicons/react';
import { TranslateIcon } from '@hugeicons/core-free-icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { locales, defaultLocale } from '@/lib/i18n/locales';

const languageNames: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  zh: '中文',
  vi: 'Tiếng Việt',
};

interface LanguageSwitcherProps {
  currentLocale: string;
  currentPath: string;
}

export function LanguageSwitcher({ currentLocale, currentPath }: LanguageSwitcherProps) {
  const getLocalizedUrl = (locale: string) => {
    // Remove any existing locale prefix from known locales
    const localesPattern = locales.join('|');
    const regex = new RegExp(`^/(${localesPattern})(/|$)`);
    let pathWithoutLocale = currentPath.replace(regex, '');
    
    // If path is empty or just '/', make it empty string
    if (!pathWithoutLocale || pathWithoutLocale === '/') {
      pathWithoutLocale = '';
    }
    
    // Ensure path starts with / if not empty
    if (pathWithoutLocale && !pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale;
    }
    
    // Always prefix with locale (prefixDefaultLocale is now true)
    return `/${locale}${pathWithoutLocale}`;
  };

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
            asChild
          >
            <a
              href={getLocalizedUrl(locale)}
              className="cursor-pointer flex items-center justify-between w-full"
            >
              <span>{languageNames[locale] || locale}</span>
              <span className="text-muted-foreground ml-2 text-[10px] uppercase">
                {locale}
              </span>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
