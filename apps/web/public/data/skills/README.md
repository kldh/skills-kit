# Public Skills Data

This directory contains individual skill JSON files for client-side runtime access.

## Structure

```
skills/
├── index.json                          # Lightweight index of all skills
├── {skill-name}.json                   # Individual skill files
└── ...
```

## Usage

### Fetch Individual Skill

```typescript
const response = await fetch('/data/skills/calculator.json')
const skill = await response.json()
```

### Fetch Skills Index

```typescript
const response = await fetch('/data/skills/index.json')
const skillsIndex = await response.json()
```

### React Hook Example

```typescript
import { useState, useEffect } from 'react'

function useSkill(skillName: string) {
  const [skill, setSkill] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/data/skills/${skillName}.json`)
      .then(res => res.json())
      .then(data => {
        setSkill(data)
        setLoading(false)
      })
  }, [skillName])

  return { skill, loading }
}
```

## Benefits

1. **Client-Side Access**: Can be fetched at runtime without bundling
2. **CDN Cacheable**: Can be cached by browsers and CDNs
3. **Dynamic Loading**: Load skills on-demand as needed
4. **Reduced Initial Bundle**: Don't include all skills in main bundle

## vs. src/data/skills/

| Feature | `src/data/skills/` | `public/data/skills/` |
|---------|-------------------|----------------------|
| Access Method | ES module import | HTTP fetch |
| Build Time | Bundled | Runtime |
| SSR/SSG | ✅ Works great | ❌ Not ideal |
| Client-Side | ✅ Works | ✅ Best choice |
| Type Safety | ✅ Yes | ⚠️ Manual typing |
| Performance | ✅ No network request | ⚠️ Network request |

## Recommendation

- **Use `src/data/skills/`** for server-side rendering and static site generation
- **Use `public/data/skills/`** for client-side dynamic loading and lazy loading
