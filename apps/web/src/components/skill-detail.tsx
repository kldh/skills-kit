import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  CodeIcon,
  EyeIcon,
} from '@hugeicons/core-free-icons'
import type { SkillWithStats } from '@/lib/skills.server'
import { getCategoryDisplayName } from '@/lib/i18n/astro'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { InstallCommand } from '@/components/install-command'
import { cn } from '@/lib/utils'

// Markdown components with light mode styling
const markdownComponents = {
  h1: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground" {...props} />
  ),
  h2: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground" {...props} />
  ),
  h3: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-xl font-semibold mt-4 mb-2 text-foreground" {...props} />
  ),
  h4: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="text-lg font-semibold mt-3 mb-2 text-foreground" {...props} />
  ),
  p: ({ ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-4 text-sm leading-relaxed text-muted-foreground" {...props} />
  ),
  ul: ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      className="list-disc list-inside mb-4 space-y-2 ml-4 text-muted-foreground"
      {...props}
    />
  ),
  ol: ({ ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      className="list-decimal list-inside mb-4 space-y-2 ml-4 text-muted-foreground"
      {...props}
    />
  ),
  li: ({ ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-sm text-muted-foreground" {...props} />
  ),
  code: ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) => {
    const isInline = !className?.includes('language-')
    return isInline ? (
      <code
        className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-primary"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code className={cn(className, 'text-sm')} {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-muted p-4 rounded-lg overflow-x-auto mb-4 text-sm border border-border"
      {...props}
    >
      {children}
    </pre>
  ),
  blockquote: ({ ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic mb-4 text-muted-foreground"
      {...props}
    />
  ),
  a: ({ ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="text-primary hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  table: ({ ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-4">
      <table
        className="min-w-full border-collapse border border-border"
        {...props}
      />
    </div>
  ),
  th: ({ ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="border border-border px-4 py-2 text-left font-semibold bg-muted text-foreground"
      {...props}
    />
  ),
  td: ({ ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-border px-4 py-2 text-muted-foreground" {...props} />
  ),
  strong: ({ ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-bold text-foreground" {...props} />
  ),
  em: ({ ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic text-muted-foreground" {...props} />
  ),
}

interface SkillDetailProps {
  skill: SkillWithStats
  locale?: string
}

export function SkillDetail({ skill, locale = 'en' }: SkillDetailProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [displayMode, setDisplayMode] = React.useState<'format' | 'raw'>(
    'format',
  )
  const [shouldShowExpand, setShouldShowExpand] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)

  // Callback ref to measure immediately when element is mounted
  const contentRefCallback = React.useCallback((node: HTMLDivElement | null) => {
    if (node) {
      contentRef.current = node
      // Measure after a brief delay to ensure content is fully rendered
      // Use requestAnimationFrame to measure after paint
      requestAnimationFrame(() => {
        const height = node.scrollHeight
        setShouldShowExpand(height > 500)
      })
    }
  }, [])

  // Auto-collapse when content or mode changes
  React.useEffect(() => {
    setIsExpanded(false)
  }, [skill.content, displayMode])

  // Measure content height with ResizeObserver for accuracy
  // Use useLayoutEffect for synchronous measurement before paint
  React.useLayoutEffect(() => {
    const measure = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight
        setShouldShowExpand(height > 500)
      }
    }

    // Measure immediately
    measure()

    const observer = new ResizeObserver(() => {
      measure()
    })

    if (contentRef.current) {
      observer.observe(contentRef.current)
    }

    return () => observer.disconnect()
  }, [skill.content, displayMode])

  const installCommand = `npx add-skill kldh/skills-kit/packages/skills-kit/skills/${skill.metadata.name}`

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-8 max-w-[700px]">
        <div className="flex items-start justify-between gap-6 mt-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-3 text-foreground tracking-tight">
              {skill.metadata.name}
            </h1>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed max-w-3xl">
              {skill.metadata.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {skill.metadata.category && (
                <Badge
                  variant="secondary"
                  className="bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 transition-colors"
                >
                  {getCategoryDisplayName(skill.metadata.category, locale)}
                </Badge>
              )}
              {skill.metadata.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-border text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                >
                  {tag}
                </Badge>
              ))}
              {skill.metadata.version && (
                <Badge
                  variant="outline"
                  className="border-border text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                >
                  v{skill.metadata.version}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="bg-muted px-4 py-2 rounded-lg border border-border">
              <div className="text-2xl font-bold text-foreground">
                {skill.installCount?.toLocaleString() || 0}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                installs
              </div>
            </div>
          </div>
        </div>

        {/* Install Guide */}
        <InstallCommand command={installCommand} className="mt-8" />
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 grid-cols-[1fr_700px_1fr] pt-16 *:col-start-2 lg:grid lg:p-12">

        <Card className="relative overflow-hidden border-border bg-card shadow-lg py-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/50">
            <div className="flex gap-2">
              <button
                type="button"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all',
                  displayMode === 'format'
                    ? 'bg-primary/10 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setDisplayMode('format')
                }}
              >
                <HugeiconsIcon icon={EyeIcon} className="w-4 h-4" />
                Format
              </button>
              <button
                type="button"
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all',
                  displayMode === 'raw'
                    ? 'bg-primary/10 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                )}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setDisplayMode('raw')
                }}
              >
                <HugeiconsIcon icon={CodeIcon} className="w-4 h-4" />
                Raw
              </button>
            </div>
            {shouldShowExpand && (
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-md hover:bg-muted transition-all"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <HugeiconsIcon
                  icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
                  className="w-4 h-4"
                />
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            )}
          </div>

          {/* Content Area */}
          <CardContent
            className={cn(
              'transition-all duration-500 ease-in-out relative ',
              !isExpanded &&
              shouldShowExpand &&
              'max-h-[500px] overflow-hidden',
            )}
          >
            <div
              ref={contentRefCallback}
              key={`${displayMode}-${skill.metadata.name}`}
              className="p-8"
            >
              {displayMode === 'format' ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={markdownComponents}
                  >
                    {skill.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="rounded-lg bg-muted border border-border p-6">
                  <pre className="text-sm font-mono whitespace-pre-wrap leading-relaxed text-muted-foreground overflow-x-auto">
                    {skill.content}
                  </pre>
                </div>
              )}
            </div>

            {/* Expand Gradient Overlay */}
            {!isExpanded && shouldShowExpand && (
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-card via-card/95 to-transparent flex items-end justify-center pb-12 pointer-events-none">
                <button
                  type="button"
                  className="shadow-lg border border-border pointer-events-auto hover:scale-105 transition-all bg-background hover:bg-muted text-foreground px-8 py-3 rounded-lg font-medium text-sm"
                  onClick={() => setIsExpanded(true)}
                >
                  Expand to see more
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
