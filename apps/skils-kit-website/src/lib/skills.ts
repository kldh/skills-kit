// Re-export types from server module
export type { SkillWithStats } from './skills.server'
export type FilterType = 'all' | 'trending' | 'new' | 'most-installed'
export type CategoryFilter = string | 'all'

/**
 * Filter skills by various criteria
 */
export function filterSkills(
  skills: SkillWithStats[],
  filterType: FilterType,
  category: CategoryFilter,
  searchQuery?: string,
  tag?: string
): SkillWithStats[] {
  let filtered = [...skills]

  // Apply tag filter
  if (tag) {
    filtered = filtered.filter(
      skill => skill.metadata.tags?.some(t => t.toLowerCase() === tag.toLowerCase())
    )
  }

  // Apply category filter
  if (category !== 'all') {
    filtered = filtered.filter(
      skill => skill.metadata.category?.toLowerCase() === category.toLowerCase()
    )
  }

  // Apply search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase()
    filtered = filtered.filter(
      skill =>
        skill.metadata.name.toLowerCase().includes(query) ||
        skill.metadata.description.toLowerCase().includes(query) ||
        skill.metadata.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // Apply filter type
  switch (filterType) {
    case 'trending':
      filtered.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0))
      break
    case 'new':
      filtered.sort((a, b) => {
        const aDate = a.createdAt?.getTime() || 0
        const bDate = b.createdAt?.getTime() || 0
        return bDate - aDate
      })
      break
    case 'most-installed':
      filtered.sort((a, b) => (b.installCount || 0) - (a.installCount || 0))
      break
    case 'all':
    default:
      // Sort by name by default
      filtered.sort((a, b) => a.metadata.name.localeCompare(b.metadata.name))
      break
  }

  return filtered
}
