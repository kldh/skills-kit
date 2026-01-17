# @repo/skills-kit

A collection of skills for AI agents following the [Agent Skills Specification](https://agentskills.io/specification) format, similar to [Vercel Labs agent-skills](https://github.com/vercel-labs/agent-skills).

## Overview

This package provides a standardized format for defining skills that AI agents can use to perform various tasks. Skills are defined in `SKILL.md` files with YAML frontmatter and markdown content, following the agent-skills specification.

**Skills are stored in markdown format** in the `skills/` directory, making them easy to read, maintain, and version control.

## Installation

```bash
pnpm add @repo/skills-kit
```

## Usage

### Loading Skills from SKILL.md Files

```typescript
import { loadAllSkills, getSkillByName, getSkillsByCategoryFromFiles } from "@repo/skills-kit";

// Load all skills from the skills/ directory
const skills = loadAllSkills();

// Get a specific skill by name
const reactSkill = getSkillByName("reactjs-best-practices");

// Get skills by category
const reactSkills = getSkillsByCategoryFromFiles("reactjs");

// Access skill metadata and content
skills.forEach((skill) => {
  console.log(skill.metadata.name);
  console.log(skill.metadata.description);
  console.log(skill.content); // Markdown content
});
```

### Using TypeScript Runtime Skills (Legacy)

```typescript
import { getAllSkills, calculatorSkill } from "@repo/skills-kit";

// Use runtime skills (TypeScript handlers)
const result = await calculatorSkill.handler({
  operation: "add",
  a: 5,
  b: 3,
});

console.log(result.data?.markdown);
```

### Finding Skills by Category

```typescript
import { getSkillsByCategoryFromFiles } from "@repo/skills-kit";

const reactSkills = getSkillsByCategoryFromFiles("reactjs");
const petCareSkills = getSkillsByCategoryFromFiles("pet-care");
```

## Skill Format

Skills follow the [Agent Skills Specification](https://agentskills.io/specification) format:

### Directory Structure

```
skills/
└── skill-name/
    ├── SKILL.md          # Required: Skill definition
    ├── scripts/          # Optional: Supporting scripts
    └── references/       # Optional: Additional docs
```

### SKILL.md Format

Each `SKILL.md` file contains:

1. **YAML Frontmatter** - Required metadata:
   ```yaml
   ---
   name: skill-name
   description: What the skill does
   category: category-name
   tags: [tag1, tag2]
   version: 1.0.0
   ---
   ```

2. **Markdown Content** - Instructions, examples, and documentation

### Skill Metadata

- **name**: Unique identifier (lowercase, hyphen-delimited)
- **description**: What the skill does and when to use it
- **category**: Category or domain (optional)
- **tags**: Array of tags for discovery (optional)
- **version**: Skill version (optional)
- **license**: License information (optional)
- **author**: Author or maintainer (optional)

## Creating Custom Skills

### Creating a SKILL.md File

1. Create a new directory: `skills/your-skill-name/`
2. Create `SKILL.md` with YAML frontmatter:

```markdown
---
name: my-custom-skill
description: Does something custom
category: custom
tags: [custom, example]
version: 1.0.0
---

# My Custom Skill

## When to Use

Describe when and how to use this skill.

## Instructions

Provide detailed instructions...

## Examples

Show example usage...
```

3. Optionally add supporting files in `scripts/` or `references/` directories

### Creating TypeScript Runtime Skills (Legacy)

```typescript
import { registerSkill, type Skill } from "@repo/skills-kit";

const myCustomSkill: Skill<{ input: string }, { markdown: string }> = {
  definition: {
    id: "my-custom-skill",
    name: "My Custom Skill",
    description: "Does something custom",
    category: "custom",
    output: {
      type: "object",
      format: "markdown",
    },
  },
  handler: async (input) => {
    const markdown = `# Processed Result\n\n**Input:** ${input.input}\n`;
    return {
      success: true,
      data: { markdown },
    };
  },
};

registerSkill(myCustomSkill);
```

## Available Skills

### SKILL.md Format Skills

#### React.js Skills

- **reactjs-best-practices** (`skills/reactjs-best-practices/SKILL.md`)
  - Provides React.js best practices, patterns, and recommendations
  - Topics: hooks, performance, state-management, component-design, testing
  - Category: `reactjs`

- **reactjs-component-generator** (`skills/reactjs-component-generator/SKILL.md`)
  - Generates React component code with TypeScript types
  - Features: functional/class components, props, styling, tests
  - Category: `reactjs`

#### Pet Care Skills

- **pet-health-advice** (`skills/pet-health-advice/SKILL.md`)
  - Provides pet health advice, care tips, and medical information
  - Pet Types: dog, cat, bird, rabbit, hamster, fish, reptile
  - Topics: nutrition, exercise, preventive care, common illnesses, emergencies
  - Category: `pet-care`

### TypeScript Runtime Skills (Legacy)

- **example** - Simple example skill
- **calculator** - Mathematical operations
- **text-processor** - Text transformations

See `src/skills/` directory for TypeScript-based skills.

## TypeScript Support

Full TypeScript support is included with type definitions for:
- `SkillDefinition`
- `SkillParameter`
- `SkillHandler`
- `Skill`
- `SkillContext`
- `SkillResult`

## Development

```bash
# Build
pnpm build

# Type check
pnpm check-types

# Lint
pnpm lint

# Watch mode
pnpm dev
```

## License

MIT
