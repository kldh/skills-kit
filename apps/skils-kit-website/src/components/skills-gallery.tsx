import { useMemo, useState } from "react"
import { Link } from "@tanstack/react-router"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import type { FilterType, SkillWithStats } from "@/lib/skills"
import { filterSkills } from "@/lib/skills"
import { getCategoryDisplayName } from "@/lib/i18n"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface SkillsGalleryProps {
  initialSkills: Array<SkillWithStats>
  initialCategories: Array<string>
  initialCategory?: string
  initialTag?: string
}

export function SkillsGallery({ initialSkills, initialCategory, initialTag }: SkillsGalleryProps) {
  const [filterType] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  // Use URL params directly as source of truth
  const category = initialCategory || "all"
  const tag = initialTag

  const filteredSkills = useMemo(
    () => filterSkills(initialSkills, filterType, category, searchQuery, tag),
    [initialSkills, filterType, category, searchQuery, tag]
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Explore</h1>
          <p className="text-muted-foreground">
            Discover and explore skills for AI agents
          </p>

          {/* Active Filters */}
          {(category !== "all" || tag) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground mr-1">Active filters:</span>

              {category !== "all" && (
                <Link
                  to="/skills"
                  search={tag ? { tag } : {}}
                  className="inline-flex items-center h-7 gap-1.5 pl-3 pr-2 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <span className="font-medium">Category:</span> {getCategoryDisplayName(category)}
                  <HugeiconsIcon icon={Cancel01Icon} className="size-3.5 opacity-70 hover:opacity-100" />
                </Link>
              )}

              {tag && (
                <Link
                  to="/skills"
                  search={category !== "all" ? { category } : {}}
                  className="inline-flex items-center h-7 gap-1.5 pl-3 pr-2 text-xs rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  <span className="font-medium">Tag:</span> {tag}
                  <HugeiconsIcon icon={Cancel01Icon} className="size-3.5 opacity-70 hover:opacity-100" />
                </Link>
              )}

              {/* Clear All button - only show when more than 1 filter is active */}
              {category !== "all" && tag && (
                <Link
                  to="/skills"
                  className="inline-flex items-center h-7 gap-1.5 px-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </Link>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <Input
                placeholder="Search for a rule or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>


          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <main className="container mx-auto px-4 py-8">
        {filteredSkills.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No skills found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <Link
                key={skill.metadata.name}
                to="/skills/$skillName"
                params={{ skillName: skill.metadata.name }}
                className="block"
              >
                <Card className="h-full hover:ring-2 hover:ring-primary transition-all cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">
                          {skill.metadata.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {skill.metadata.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {skill.metadata.category && (
                        <Badge variant="secondary">
                          {getCategoryDisplayName(skill.metadata.category)}
                        </Badge>
                      )}
                      {skill.metadata.tags?.slice(0, 3).map((skillTag: string) => (
                        <Badge key={skillTag} variant="outline" className="text-xs">
                          {skillTag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {skill.installCount?.toLocaleString() || 0} installs
                      </span>
                      {skill.metadata.version && (
                        <span>v{skill.metadata.version}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
