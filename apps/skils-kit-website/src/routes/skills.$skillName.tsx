import { createFileRoute } from '@tanstack/react-router'
import type { SkillWithStats } from '@/lib/skills.server'
import { SkillDetail } from '@/components/skill-detail'
import { TagsSidebar } from '@/components/tags-sidebar'
import { getAllTags, getCategories, getSkillByName } from '@/lib/skills.server'

export const Route = createFileRoute('/skills/$skillName')({
  validateSearch: (search: Record<string, unknown> | undefined): {
    category?: string
    tag?: string
  } => {
    const result: { category?: string; tag?: string } = {}
    if (search?.category && typeof search.category === 'string') {
      result.category = search.category
    }
    if (search?.tag && typeof search.tag === 'string') {
      result.tag = search.tag
    }
    return result
  },
  // @ts-expect-error - TanStack Router type inference issue with SkillMetadata index signature
  loader: ({ params }) => {
    const skill = getSkillByName(params.skillName)
    if (!skill) {
      throw new Error(`Skill "${params.skillName}" not found`)
    }
    const tags = getAllTags()
    const categories = getCategories()
    return { skill, tags, categories }
  },
  component: SkillDetailPage,
  prerender: true, 
})

function SkillDetailPage() {
  const loaderData = Route.useLoaderData() as {
    skill: SkillWithStats
    tags: Array<string>
    categories: Array<string>
  }
  const { skill, tags, categories } = loaderData
  const search = Route.useSearch()
  const currentCategory = search.category
  const currentTag = search.tag

  return (
    <div className="flex min-h-screen bg-background">
      <TagsSidebar
        categories={categories}
        tags={tags}
        currentCategory={currentCategory}
        currentTag={currentTag}
      />
      <div className="flex-1 lg:ml-64">
        <SkillDetail skill={skill} />
      </div>
    </div>
  )
}
