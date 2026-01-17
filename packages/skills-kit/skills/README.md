# Skills Directory

This directory contains skills following the [Agent Skills Specification](https://agentskills.io/specification) format, similar to the [Vercel Labs agent-skills](https://github.com/vercel-labs/agent-skills) repository.

## Structure

Each skill is organized in its own directory with the following structure:

```
skills/
└── skill-name/
    ├── SKILL.md          # Required: Skill definition with YAML frontmatter
    ├── scripts/          # Optional: Executable code that agents can run
    ├── references/       # Optional: Additional documentation
    └── assets/           # Optional: Static resources (templates, images, data)
```

## SKILL.md Format

Each `SKILL.md` file must contain:

1. **YAML Frontmatter** - Metadata about the skill
2. **Markdown Content** - Instructions, examples, and documentation

### Required Frontmatter Fields

| Field | Required | Constraints |
|-------|----------|-------------|
| `name` | Yes | Max 64 chars. Lowercase letters, numbers, and hyphens only. Must not start or end with a hyphen. Must match parent directory name. |
| `description` | Yes | Max 1024 chars. Describes what the skill does AND when to use it. |

```yaml
---
name: skill-name
description: What the skill does and when to use it. Include keywords for discovery.
---
```

### Optional Frontmatter Fields

| Field | Constraints |
|-------|-------------|
| `license` | License name or reference to a bundled license file |
| `compatibility` | Max 500 chars. Environment requirements (intended product, system packages, network access, etc.) |
| `metadata` | Key-value mapping for additional metadata (category, version, tags, author, etc.) |
| `allowed-tools` | Space-delimited list of pre-approved tools (experimental) |

### Example

```yaml
---
name: reactjs-best-practices
description: Provides React.js best practices, patterns, and recommendations. Use when you need guidance on hooks, performance, state management, or component design.
license: MIT
metadata:
  category: reactjs
  version: "1.0.0"
  tags: react, best-practices, patterns, guidelines
  author: your-org
---

# Skill Title

Skill content in markdown format...
```

## Available Skills

### Math Skills

- **calculator** - Performs basic mathematical operations (add, subtract, multiply, divide)

### Text Processing Skills

- **text-processor** - Processes and transforms text (uppercase, lowercase, reverse, word count, etc.)

### React.js Skills

- **reactjs-best-practices** - React.js best practices, patterns, and recommendations
- **reactjs-component-generator** - Generates React component code with TypeScript types

### Pet Care Skills

- **pet-health-advice** - Pet health advice, care tips, and medical information

### Deployment Skills

- **vercel-deploy** - Deploy web applications to Vercel with automatic framework detection and preview URLs

### Design Skills

- **web-design-guidelines** - Comprehensive web design and UI/UX guidelines covering accessibility, performance, and more

### Utility Skills

- **example** - A simple example skill that demonstrates the skill format

## Adding New Skills

To add a new skill:

1. Create a new directory: `skills/your-skill-name/`
   - Name must be lowercase, using only letters, numbers, and hyphens
   - Name must not start or end with a hyphen
   - Name must not contain consecutive hyphens (`--`)
2. Create `SKILL.md` with YAML frontmatter and markdown content
   - `name` field must match the directory name exactly
   - `description` should describe both what the skill does AND when to use it
3. Optionally add supporting directories:
   - `scripts/` - Executable code (Python, Bash, JavaScript)
   - `references/` - Additional documentation
   - `assets/` - Static resources (templates, images, data)

### Progressive Disclosure

Keep your main `SKILL.md` under 500 lines. Structure skills for efficient context usage:

1. **Metadata** (~100 tokens): `name` and `description` loaded at startup for all skills
2. **Instructions** (<5000 tokens): Full `SKILL.md` body loaded when skill is activated
3. **Resources** (as needed): Files in `scripts/`, `references/`, or `assets/` loaded only when required

## Loading Skills

Skills can be loaded programmatically:

```typescript
import { loadAllSkills, getSkillByName } from "@repo/skills-kit";

// Load all skills
const skills = loadAllSkills();

// Get a specific skill
const skill = getSkillByName("reactjs-best-practices");
```

## References

- [Agent Skills Specification](https://agentskills.io/specification)
- [Vercel Labs agent-skills](https://github.com/vercel-labs/agent-skills)
