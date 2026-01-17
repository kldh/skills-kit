import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadAllSkills } from '@repo/skills-kit'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const LANGUAGES = ['en', 'es', 'fr', 'de', 'ja', 'zh'] as const
const DEFAULT_LANG = 'en'

// Output directories
const PUBLIC_DATA_DIR = join(__dirname, '..', 'public', 'data')
const SRC_DATA_DIR = join(__dirname, '..', 'src', 'data')

interface SearchMapping {
  tags: Record<string, {
    count: number
    skills: string[]
  }>
  categories: Record<string, {
    count: number
    skills: string[]
  }>
  skills: Record<string, {
    name: string
    description: string
    category?: string
    tags: string[]
  }>
}

/**
 * Generate search mapping JSON files for each language
 */
function generateSearchMappings(): void {
  console.log('Generating search mappings...')
  
  const skills = loadAllSkills()
  
  // Build tag and category mappings
  const tagMap = new Map<string, Set<string>>()
  const categoryMap = new Map<string, Set<string>>()
  const skillsMap = new Map<string, {
    name: string
    description: string
    category?: string
    tags: string[]
  }>()
  
  skills.forEach((skill) => {
    const skillName = skill.metadata.name
    
    // Add skill to map
    skillsMap.set(skillName, {
      name: skill.metadata.name,
      description: skill.metadata.description || '',
      category: skill.metadata.category,
      tags: (skill.metadata.tags || []) as string[],
    })
    
    // Process tags
    if (skill.metadata.tags && Array.isArray(skill.metadata.tags)) {
      skill.metadata.tags.forEach((tag) => {
        if (typeof tag === 'string' && tag) {
          if (!tagMap.has(tag)) {
            tagMap.set(tag, new Set())
          }
          tagMap.get(tag)!.add(skillName)
        }
      })
    }
    
    // Process category
    if (skill.metadata.category && typeof skill.metadata.category === 'string') {
      const category = skill.metadata.category
      if (!categoryMap.has(category)) {
        categoryMap.set(category, new Set())
      }
      categoryMap.get(category)!.add(skillName)
    }
  })
  
  // Convert to plain objects
  const tags: Record<string, { count: number; skills: string[] }> = {}
  tagMap.forEach((skillSet, tag) => {
    tags[tag] = {
      count: skillSet.size,
      skills: Array.from(skillSet).sort(),
    }
  })
  
  const categories: Record<string, { count: number; skills: string[] }> = {}
  categoryMap.forEach((skillSet, category) => {
    categories[category] = {
      count: skillSet.size,
      skills: Array.from(skillSet).sort(),
    }
  })
  
  const skillsObj: Record<string, {
    name: string
    description: string
    category?: string
    tags: string[]
  }> = {}
  skillsMap.forEach((skill, name) => {
    skillsObj[name] = skill
  })
  
  const mapping: SearchMapping = {
    tags,
    categories,
    skills: skillsObj,
  }
  
  // Ensure directories exist
  mkdirSync(PUBLIC_DATA_DIR, { recursive: true })
  mkdirSync(SRC_DATA_DIR, { recursive: true })
  
  // Generate mapping for each language in public/data (for static serving)
  LANGUAGES.forEach((lang) => {
    const outputPath = join(PUBLIC_DATA_DIR, `search-mapping.${lang}.json`)
    writeFileSync(outputPath, JSON.stringify(mapping, null, 2), 'utf-8')
    console.log(`✓ Generated search mapping for ${lang}: ${outputPath}`)
  })
  
  // Also generate a default one (for / path) in public/data
  const publicDefaultPath = join(PUBLIC_DATA_DIR, 'search-mapping.json')
  writeFileSync(publicDefaultPath, JSON.stringify(mapping, null, 2), 'utf-8')
  console.log(`✓ Generated default search mapping: ${publicDefaultPath}`)
  
  // Generate to src/data for direct import (no fs needed at runtime)
  const srcPath = join(SRC_DATA_DIR, 'search-mapping.json')
  writeFileSync(srcPath, JSON.stringify(mapping, null, 2), 'utf-8')
  console.log(`✓ Generated importable search mapping: ${srcPath}`)
  
  console.log(`✓ Generated mappings for ${skills.length} skills`)
  console.log(`  - ${Object.keys(tags).length} tags`)
  console.log(`  - ${Object.keys(categories).length} categories`)
}

/**
 * Generate static route manifest for build-time generation
 * Routes are prefixed with language codes: /$lang/...
 */
function generateRouteManifest(): void {
  console.log('Generating route manifest...')
  
  const skills = loadAllSkills()
  
  // Generate routes with language prefixes
  const routes: Record<string, string[]> = {}
  
  // Add root redirect route
  routes['/'] = [DEFAULT_LANG]
  
  // Generate routes for each language
  LANGUAGES.forEach((lang) => {
    // Home page
    routes[`/${lang}/`] = [lang]
    
    // Skills index
    routes[`/${lang}/skills/`] = [lang]
    
    // Individual skill pages
    skills.forEach((skill) => {
      routes[`/${lang}/skills/${skill.metadata.name}`] = [lang]
    })
  })
  
  const manifest = {
    languages: LANGUAGES,
    defaultLanguage: DEFAULT_LANG,
    routes,
  }
  
  mkdirSync(PUBLIC_DATA_DIR, { recursive: true })
  
  const manifestPath = join(PUBLIC_DATA_DIR, 'route-manifest.json')
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')
  console.log(`✓ Generated route manifest: ${manifestPath}`)
  console.log(`  - ${Object.keys(routes).length} routes generated`)
}

/**
 * Generate complete skills data JSON file (for static loading)
 */
function generateSkillsData(): void {
  console.log('Generating skills data file...')
  
  const skills = loadAllSkills()
  
  // Add mock stats (same as in skills.server.ts)
  const skillsWithStats = skills.map((skill, index) => ({
    ...skill,
    installCount: Math.floor(Math.random() * 10000) + 100,
    trendingScore: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))
  
  mkdirSync(PUBLIC_DATA_DIR, { recursive: true })
  mkdirSync(SRC_DATA_DIR, { recursive: true })
  
  // Write to public/data for static serving
  const publicSkillsPath = join(PUBLIC_DATA_DIR, 'skills.json')
  writeFileSync(publicSkillsPath, JSON.stringify(skillsWithStats, null, 2), 'utf-8')
  console.log(`✓ Generated skills data: ${publicSkillsPath}`)
  
  // Write to src/data for direct import (no fs needed at runtime)
  const srcSkillsPath = join(SRC_DATA_DIR, 'skills.json')
  writeFileSync(srcSkillsPath, JSON.stringify(skillsWithStats, null, 2), 'utf-8')
  console.log(`✓ Generated importable skills data: ${srcSkillsPath}`)
  
  console.log(`  - ${skillsWithStats.length} skills with metadata`)
}

// Run generation
try {
  generateSearchMappings()
  generateRouteManifest()
  generateSkillsData()
  console.log('✓ Build data generation complete!')
} catch (error) {
  console.error('Error generating build data:', error)
  process.exit(1)
}
