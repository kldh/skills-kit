# Skills Data Structure Overview

## Visual Comparison

### Before Refactoring ❌

```
apps/web/
├── src/data/
│   └── skills.json                          # Single file with all skills
│       └── [8 skills combined]
│
└── public/data/
    └── skills.json                          # Single file with all skills
        └── [8 skills combined]
```

**Problems:**
- ❌ Large monolithic files hard to maintain
- ❌ Large git diffs when updating any skill
- ❌ Merge conflicts likely
- ❌ Cannot lazy-load individual skills
- ❌ All-or-nothing import

### After Refactoring ✅

```
apps/web/
├── src/data/
│   ├── skills.json                          # Backward compatibility
│   └── skills/                              # New structure
│       ├── index.json                       # Lightweight index
│       ├── vercel-react-best-practices.json # Individual skills
│       ├── web-design-guidelines.json
│       └── README.md
│
└── public/data/
    ├── skills.json                          # Backward compatibility
    └── skills/                              # New structure
        ├── index.json                       # Lightweight index
        ├── calculator.json                  # Individual skills
        ├── example.json
        ├── pet-health-advice.json
        ├── reactjs-best-practices.json
        ├── reactjs-component-generator.json
        ├── text-processor.json
        ├── vercel-deploy.json
        ├── web-design-guidelines.json
        └── README.md
```

**Benefits:**
- ✅ Small, focused files easy to maintain
- ✅ Small git diffs per skill
- ✅ Minimal merge conflicts
- ✅ Lazy-load individual skills
- ✅ Import only what you need

## File Sizes Comparison

### Before (Monolithic)

| File | Size | Skills |
|------|------|--------|
| `src/data/skills.json` | ~10KB | 2 |
| `public/data/skills.json` | ~58KB | 8 |
| **Total** | **68KB** | **10** |

### After (Individual Files)

| File | Size | Description |
|------|------|-------------|
| `src/data/skills/index.json` | ~1KB | Metadata only |
| `src/data/skills/*.json` | ~8KB | Individual skills |
| `public/data/skills/index.json` | ~4KB | Metadata only |
| `public/data/skills/*.json` | ~63KB | Individual skills |
| **Total** | **~76KB** | **Same data + indexes** |

**Note:** Slightly larger total size, but now with flexibility to load only what's needed!

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  @repo/skills-kit                                                │
│  └── skills-data.generated.json                                  │
│      └── Source of truth for all skills                         │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│  npm run generate:data                                           │
│  └── scripts/generate-web-data.ts                                │
│      ├── Reads skills from @repo/skills-kit                      │
│      ├── Adds random stats (installCount, trendingScore, dates)  │
│      └── Generates output files                                  │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌─────────────────────┐    ┌─────────────────────┐
│  src/data/          │    │  public/data/       │
│  ├── skills.json    │    │  ├── skills.json    │
│  └── skills/        │    │  └── skills/        │
│      ├── index.json │    │      ├── index.json │
│      └── *.json     │    │      └── *.json     │
└──────┬──────────────┘    └──────┬──────────────┘
       │                          │
       ▼                          ▼
┌──────────────────┐    ┌──────────────────────┐
│  SSR/SSG Import  │    │  Client-side Fetch   │
│  (Build time)    │    │  (Runtime)           │
└──────────────────┘    └──────────────────────┘
```

## Usage Patterns

### Pattern 1: List All Skills (Lightweight)

```typescript
// ✅ Best: Use index for listings
import { getSkillsIndex } from '@/lib/skills.server'

const skills = getSkillsIndex()
// Only loads: name, description, category, tags, stats
// Does NOT load: full content markdown
```

**Use Cases:**
- Skill browse/search page
- Skill cards grid
- Category filtering
- Tag filtering
- Sorting by stats

**Performance:**
- src: ~1KB (2 skills)
- public: ~4KB (8 skills)

### Pattern 2: Get Single Skill (On-Demand)

```typescript
// ✅ Best: Load individual skill
const skill = await loadSkillByName('calculator')

// Or direct import
import calculator from '@/data/skills/calculator.json'
```

**Use Cases:**
- Skill detail page
- Skill preview modal
- Individual skill display

**Performance:**
- Loads only the specific skill needed
- ~1-18KB per skill depending on content length

### Pattern 3: Get All Skills (When Needed)

```typescript
// ✅ Use when you actually need all content
import { getAllSkills } from '@/lib/skills.server'

const skills = getAllSkills()
// Loads EVERYTHING: metadata + full markdown content
```

**Use Cases:**
- Full-text search
- Export functionality
- Admin/management pages
- When you truly need all data

**Performance:**
- src: ~10KB (2 skills)
- public: ~58KB (8 skills)

## Performance Comparison

### Loading Skill List Page

**Before:**
```
Load skills.json (58KB) → Parse all skills → Display list
```
Total: 58KB

**After:**
```
Load index.json (4KB) → Parse index → Display list
```
Total: 4KB ✨ **93% smaller!**

### Loading Skill Detail Page

**Before:**
```
Load skills.json (58KB) → Parse all → Find one skill
```
Total: 58KB

**After:**
```
Load calculator.json (3KB) → Parse → Display
```
Total: 3KB ✨ **95% smaller!**

## Best Practices

### ✅ DO

```typescript
// ✅ Use index for listings
const skills = getSkillsIndex()

// ✅ Load individual skills on detail pages
const skill = await loadSkillByName('calculator')

// ✅ Direct import when skill is known at build time
import calculator from '@/data/skills/calculator.json'

// ✅ Fetch individual skills client-side
fetch('/data/skills/calculator.json')
```

### ❌ DON'T

```typescript
// ❌ Don't load all skills just for a list
const allSkills = getAllSkills()
const names = allSkills.map(s => s.metadata.name)

// ❌ Don't load all skills to find one
const allSkills = getAllSkills()
const one = allSkills.find(s => s.metadata.name === 'calculator')
```

## Backward Compatibility

All existing code continues to work without changes:

```typescript
// ✅ Still works - no breaking changes
import { getAllSkills, getSkillByName } from '@/lib/skills.server'

const skills = getAllSkills()
const skill = getSkillByName('calculator')
```

## Migration Checklist

- [x] Individual skill files created
- [x] Index files created
- [x] Generation script updated
- [x] API functions added
- [x] Documentation created
- [x] Build tested
- [x] TypeScript types verified
- [x] Backward compatibility maintained
- [x] README files added
- [x] Examples provided

## Next Steps

To use the new structure in your application:

1. **For skill lists**: Use `getSkillsIndex()`
2. **For skill details**: Use `loadSkillByName(name)`
3. **For client-side**: Fetch from `/data/skills/{name}.json`
4. **Keep existing code**: No changes needed, works as before!

## Questions?

- Check `src/data/skills/README.md` for src/data usage
- Check `public/data/skills/README.md` for public/data usage
- Review `SKILLS_REFACTORING.md` for complete details
- Examine `src/lib/skills.server.ts` for API reference
