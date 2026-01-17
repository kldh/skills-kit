import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { Github01Icon } from '@hugeicons/core-free-icons'
import { LanguageSwitcher } from '@/components/language-switcher'
import * as m from '@/paraglide/messages'

export function GlobalHeader() {
  // Locale is automatically handled by Paraglide URL rewriting
  // Links use canonical paths, output rewriting adds locale prefix when needed
  return (
    <nav className="h-16 flex items-center justify-between px-6 border-b border-border bg-background sticky top-0 z-50">
      <Link
        to="/"
        className="text-foreground text-sm font-semibold tracking-tight hover:text-primary transition-colors"
      >
        {m.header_skills_kit()}
      </Link>
      <div className="flex items-center gap-6">
        <Link
          to="/skills"
          search={{}}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {m.header_explore()}
        </Link>
        <Link
          to="/skills"
          search={{}}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {m.header_trending()}
        </Link>
        <Link
          to="/skills"
          search={{}}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {m.header_docs()}
        </Link>
        <a
          href="https://github.com/kldh/skills-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub repository"
        >
          <HugeiconsIcon icon={Github01Icon} className="size-5" />
        </a>
        <LanguageSwitcher />
      </div>
    </nav>
  )
}
