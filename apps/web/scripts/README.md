# Web Data Generation Scripts

This directory contains scripts to generate data files for the web application from the skills in `@repo/skills-kit`.

## Scripts

### `generate-web-data.ts`

Generates `skills.json` and `search-mapping.json` in the `src/data/` directory.

**What it does:**
1. Loads skills from `@repo/skills-kit/src/skills-data.generated.json`
2. Adds demo data (installCount, trendingScore, timestamps)
3. Generates `skills.json` with complete skill information
4. Generates `search-mapping.json` with tags and categories for search functionality

## Usage

### Regenerate web data only

```bash
cd apps/web
pnpm run generate:data
```

### Regenerate everything (skills + web data)

From the root of the monorepo:

```bash
pnpm run generate
```

This will:
1. Generate skills data in `packages/skills-kit/src/skills-data.generated.json`
2. Generate web data in `apps/web/src/data/`

## When to Regenerate

You should regenerate the data when:

- Adding new skills to `packages/skills-kit/skills/`
- Updating skill metadata (name, description, tags, category)
- Modifying skill content

## Generated Files

### `src/data/skills.json`

Array of skills with:
- `metadata` - Skill metadata (name, description, tags, category, etc.)
- `content` - Full markdown content
- `path` - Path to skill directory
- `installCount` - Random demo data (100-9099)
- `trendingScore` - Random demo data (0-99)
- `createdAt` - Random past date (100-300 days ago)
- `updatedAt` - Random past date (0-90 days ago)

### `src/data/search-mapping.json`

Search index with:
- `tags` - Map of tags to skills
- `categories` - Map of categories to skills

Each entry includes:
- `count` - Number of skills with this tag/category
- `skills` - Array of skill names

## Example

```json
{
  "tags": {
    "react": {
      "count": 1,
      "skills": ["vercel-react-best-practices"]
    }
  },
  "categories": {
    "react": {
      "count": 1,
      "skills": ["vercel-react-best-practices"]
    }
  }
}
```
