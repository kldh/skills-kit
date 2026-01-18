import { createFileRoute } from '@tanstack/react-router'
import type { SkillWithStats } from '@/lib/skills.server'
import { SkillsGallery } from '@/components/skills-gallery'
import { TagsSidebar } from '@/components/tags-sidebar'
import { getAllSkills, getAllTags, getCategories } from '@/lib/skills.server'

export const Route = createFileRoute('/skills/')({
  validateSearch: (search: Record<string, unknown> | undefined): {
    category?: string
    tag?: string
    q?: string
  } => {
    const result: { category?: string; tag?: string; q?: string } = {}
    if (search?.category && typeof search.category === 'string') {
      result.category = search.category
    }
    if (search?.tag && typeof search.tag === 'string') {
      result.tag = search.tag
    }
    if (search?.q && typeof search.q === 'string') {
      result.q = search.q
    }
    return result
  },
  // @ts-expect-error - TanStack Router type inference issue with SkillMetadata index signature
  loader: ({ search }) => {
    const skills = getAllSkills()
    const categories = getCategories()
    const tags = getAllTags()
    return {
      skills,
      categories,
      tags,
      currentCategory: search?.category,
      currentTag: search?.tag,
    }
  },
  component: SkillsGalleryPage,
  prerender: true,
})

function SkillsGalleryPage() {
  const loaderData = Route.useLoaderData() as {
    skills: Array<SkillWithStats>
    categories: Array<string>
    tags: Array<string>
    currentCategory?: string
    currentTag?: string
  }
  const { skills, categories, tags } = loaderData
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
        <SkillsGallery
          initialSkills={skills}
          initialCategories={categories}
          initialCategory={currentCategory}
          initialTag={currentTag}
        />
      </div>
    </div>
  )
}
