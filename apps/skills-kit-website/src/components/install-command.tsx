import * as React from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { CopyIcon, Tick02Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'

interface InstallCommandProps {
  command: string
  className?: string
}

export function InstallCommand({ command, className }: InstallCommandProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <div className="bg-card border border-border rounded-xl px-6 py-4 shadow-lg flex items-center gap-4 group">
        <code className="text-sm font-mono text-foreground">{command}</code>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleCopy}
          className="shrink-0"
          aria-label={copied ? 'Copied!' : 'Copy command'}
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : CopyIcon}
            className={`w-4 h-4 ${copied ? 'text-green-500' : ''}`}
          />
        </Button>
      </div>
    </div>
  )
}
