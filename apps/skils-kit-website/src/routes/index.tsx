import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowRight01Icon,
  CodeIcon,
  CopyIcon,
  LayoutIcon,
  Tick02Icon,
} from '@hugeicons/core-free-icons'
import { getCategoryDisplayName } from '@/lib/i18n'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAllSkills, getCategories } from '@/lib/skills.server'
import * as m from '@/paraglide/messages'

export const Route = createFileRoute('/')({
  // @ts-expect-error - TanStack Router type inference issue with SkillMetadata index signature
  loader: () => {
    const skills = getAllSkills()
    const categories = getCategories()
    return { skills, categories }
  },
  component: App,
  prerender: true,
})

function SkillCard({ skill }: { skill: any }) {
  return (
    <Link
      to="/skills/$skillName"
      params={{ skillName: skill.metadata.name }}
      className="group block"
    >
      <Card className="h-full bg-card/40 border-border/50 hover:border-primary/50 hover:bg-card/60 transition-all duration-200">
        <CardHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={CodeIcon} className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {skill.metadata.name
                  .split('-')
                  .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
                  .join(' ')}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                {skill.metadata.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skill.metadata.tags?.slice(0, 2).map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-[10px] py-0 px-1.5 h-5 bg-secondary/50 font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function SkillSection({
  title,
  skills,
  viewAllLink,
}: {
  title: string
  skills: Array<any>
  viewAllLink?: string
}) {
  if (skills.length === 0) return null

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {viewAllLink && (
          <Link
            to="/skills"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            {m.view_all()}{' '}
            <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((skill) => (
          <SkillCard key={skill.metadata.name} skill={skill} />
        ))}
      </div>
    </section>
  )
}

function App() {
  const { skills, categories } = Route.useLoaderData()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)

  // Get featured skills
  const featuredSkills = [...skills]
    .sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
    .slice(0, 4)

  // Group skills by category
  const skillsByCategory = categories.map((category) => ({
    name: category,
    skills: skills.filter((s) => s.metadata.category === category).slice(0, 4),
  }))

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate({ to: '/skills', search: { q: searchQuery } })
    }
  }

  const handleCopy = async () => {
    const command = 'npx add-skill kldh/skills-kit'
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {m.hero_title()}
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                {m.hero_subtitle()}
              </p>

              {/* Install Guide */}
              <div className="mt-8 flex items-center justify-center">
                <div className="bg-card border border-border rounded-xl px-6 py-4 shadow-lg flex items-center gap-4 group">
                  <code className="text-sm font-mono text-foreground">
                    npx add-skill kldh/skills-kit
                  </code>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleCopy}
                    className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={copied ? 'Copied!' : 'Copy command'}
                  >
                    <HugeiconsIcon
                      icon={copied ? Tick02Icon : CopyIcon}
                      className={`w-4 h-4 ${copied ? 'text-green-500' : ''}`}
                    />
                  </Button>
                </div>
              </div>
            </div>

            {/* Search Bar
            <form
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto relative group"
            >
              <HugeiconsIcon
                icon={SearchIcon}
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10"
              />
              <Input
                type="text"
                placeholder={m.search_placeholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-16 text-lg pl-14 pr-4 bg-card border-border focus:border-primary/50 rounded-2xl transition-all shadow-lg focus:ring-0"
              />
            </form> */}
          </div>
        </div>
      </section>

      <main className="container max-w-5xl mx-auto px-4 pb-20 space-y-12">
        {/* Featured Bar (Matching "Featured MCPs") */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {m.featured_categories()}
            </h3>
            <Link
              to="/skills"
              className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
            >
              {m.view_all()}
            </Link>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {categories.map((category) => (
              <Link
                key={category}
                to="/skills"
                className="flex flex-col items-center gap-2 p-3 min-w-[100px] rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-accent transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <HugeiconsIcon
                    icon={LayoutIcon}
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary"
                  />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-center">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Cards (Matching "Featured Jobs") */}
        {/* <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {m.top_trending()}
            </h3>
            <div className="space-y-4">
              {featuredSkills.slice(0, 3).map((skill) => (
                <Link
                  key={skill.metadata.name}
                  to="/skills/$skillName"
                  params={{ skillName: skill.metadata.name }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <HugeiconsIcon
                      icon={FlashIcon}
                      className="w-5 h-5 text-primary"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate uppercase tracking-wider">
                      {skill.metadata.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {skill.metadata.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {m.spotlight()}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <Card className="bg-card border-border p-6 flex flex-col justify-between hover:border-primary/30 transition-all group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={LicenseIcon}
                      className="w-6 h-6 text-orange-500"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {m.become_creator_title()}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {m.become_creator_desc()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="mt-6 w-full text-xs font-bold uppercase tracking-widest h-10"
                >
                  {m.view_program()}
                </Button>
              </Card>
              <Card className="bg-card border-border p-6 flex flex-col justify-between hover:border-blue-500/30 transition-all group">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={AiChat01Icon}
                      className="w-6 h-6 text-blue-500"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors">
                      {m.expert_help_title()}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {m.expert_help_desc()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="mt-6 w-full text-xs font-bold uppercase tracking-widest h-10"
                >
                  {m.get_support()}
                </Button>
              </Card>
            </div>
          </div>
        </section> */}

        {/* Categorized Skills (TypeScript, React, etc.) */}
        <div className="space-y-16">
          {skillsByCategory.map((cat) => (
            <SkillSection
              key={cat.name}
              title={getCategoryDisplayName(cat.name)}
              skills={cat.skills}
              viewAllLink="/skills"
            />
          ))}
        </div>
      </main>
    </div>
  )
}
