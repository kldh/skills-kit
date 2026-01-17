# Skills Kit 🧠

**Share knowledge. Empower AI agents. Skill up the world.**

Skills Kit is an open platform that makes it easy for anyone to create, share, and discover skills for AI agents. Whether you're a developer, designer, or domain expert—your knowledge can help AI assistants become smarter and more capable.

## ✨ Why Skills Kit?

Traditional AI prompts are scattered, hard to maintain, and rarely shared. Skills Kit changes that by providing:

- **📝 Simple Markdown Format** — Skills are just markdown files. No coding required.
- **🌍 Share with Everyone** — Your skills are discoverable through the Skills Gallery
- **🔍 Searchable & Organized** — Filter by category, tags, or search by keywords
- **🌐 Multi-language Ready** — Built-in support for 6 languages (EN, DE, ES, FR, JA, ZH)
- **⚡ AI Agent Compatible** — Follows the [Agent Skills Specification](https://agentskills.io/specification)

## 📦 What's Inside?

```
skills-kit/
├── apps/
│   └── skils-kit-website/     # 🖥️ Skills Gallery Website
├── packages/
│   ├── skills-kit/            # 📚 Core skills library
│   │   └── skills/            # 🎯 All skill definitions
│   ├── ui/                    # 🎨 Shared UI components
│   └── typescript-config/     # ⚙️ TypeScript configs
```

### Available Skills

| Skill | Category | Description |
|-------|----------|-------------|
| `reactjs-best-practices` | React | Best practices, patterns & optimization tips |
| `reactjs-component-generator` | React | Generate React components with TypeScript |
| `web-design-guidelines` | Design | Web design principles and accessibility |
| `pet-health-advice` | Pet Care | Health tips for dogs, cats, birds & more |
| `vercel-deploy` | DevOps | Deploy applications to Vercel |
| `calculator` | Utility | Mathematical operations |
| `text-processor` | Utility | Text transformations |

## 🚀 Quick Start

### Install Dependencies

```bash
pnpm install
```

### Start Development

```bash
# Start the Skills Gallery website
pnpm dev

# Or run a specific app
pnpm dev --filter=skils-kit-website
```

The website will be available at `http://localhost:3001`

### Build for Production

```bash
pnpm build
```

## 🎯 Creating Your Own Skill

Creating a skill is as simple as writing a markdown file. No programming required!

### 1. Create a skill directory

```bash
mkdir -p packages/skills-kit/skills/my-awesome-skill
```

### 2. Add a `SKILL.md` file

```markdown
---
name: my-awesome-skill
description: What this skill does and when to use it
metadata:
  category: your-category
  version: "1.0.0"
  tags:
    - tag1
    - tag2
  owner: your-name
---

# My Awesome Skill

## When to Use

Describe when and how AI agents should use this skill.

## Instructions

Provide detailed instructions, examples, and best practices.

## Examples

Show example inputs and outputs.
```

### 3. That's it! 🎉

Your skill will automatically be picked up and displayed in the Skills Gallery.

## 🌐 Skills Gallery Website

The Skills Gallery is a beautiful, searchable interface for discovering skills:

- **🔍 Smart Search** — Find skills by name, description, or keywords
- **📂 Category Filters** — Browse by React, Design, Pet Care, Utility, etc.
- **🏷️ Tag Navigation** — Click tags to find related skills
- **📊 Trending & Popular** — Discover what's most used
- **🌍 Multi-language** — Switch between 6 supported languages

### Tech Stack

- ⚛️ **React 19** with TypeScript
- 🛣️ **TanStack Router** for type-safe routing
- 🎨 **Tailwind CSS** + **shadcn/ui** for beautiful UI
- 🌐 **Paraglide** for i18n
- ⚡ **Vite** for blazing fast builds
- 📦 **Turborepo** for monorepo management

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Create new skills** — Share your domain expertise
2. **Improve existing skills** — Add examples, fix typos, expand coverage
3. **Translate skills** — Help make skills available in more languages
4. **Report issues** — Found a bug? Let us know!
5. **Suggest features** — Have ideas? We'd love to hear them!

## 📖 Documentation

- [Creating Skills](./packages/skills-kit/README.md) — Detailed guide on skill format
- [Skills Specification](https://agentskills.io/specification) — Agent Skills standard

## 🛠️ Development Commands

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build

# Type check
pnpm check-types

# Lint & format
pnpm lint
pnpm format
```

## 📄 License

MIT

---

<p align="center">
  <strong>Built with ❤️ for the AI community</strong>
  <br/>
  <em>Making knowledge shareable, one skill at a time.</em>
</p>
