---
name: vercel-deploy
description: Deploy web applications to Vercel with automatic framework detection, preview URLs, and claimable deployments. Use when deploying apps, creating preview URLs, or sharing live previews with stakeholders.
metadata:
  category: deployment
  version: "1.0.0"
  tags:
    - deploy
    - vercel
    - hosting
    - preview
    - ci-cd
    - automation
    - deployment
    - cloud
  owner: vercel-labs
  originalSource: https://github.com/vercel-labs/agent-skills
---

# Vercel Deploy

This skill enables deploying web applications to Vercel directly from conversations or automated workflows. It provides automatic framework detection, preview deployments, and claimable URLs for transferring ownership.

## When to Use

Use this skill when you need to:

- Deploy a web application to Vercel
- Create a preview deployment for testing
- Share a live preview with stakeholders
- Transfer deployment ownership to another user
- Deploy static HTML projects
- Quickly prototype and share ideas

## Features

### Automatic Framework Detection

The skill automatically detects the framework from your `package.json` and configures the deployment accordingly.

**Supported Frameworks (40+):**

| Framework | Detection Method |
|-----------|-----------------|
| Next.js | `next` in dependencies |
| React | `react-scripts` or `create-react-app` |
| Vue.js | `@vue/cli-service` or `vite` with Vue |
| Nuxt | `nuxt` in dependencies |
| Svelte/SvelteKit | `@sveltejs/kit` or `svelte` |
| Angular | `@angular/core` |
| Remix | `@remix-run/react` |
| Astro | `astro` in dependencies |
| Gatsby | `gatsby` in dependencies |
| Vite | `vite` in dependencies |
| Express | `express` in dependencies |
| Fastify | `fastify` in dependencies |
| Nest.js | `@nestjs/core` |
| Static HTML | No package.json detected |

### Preview Deployments

Every deployment generates:

1. **Preview URL** - A unique URL for the deployment (e.g., `https://project-abc123.vercel.app`)
2. **Claim URL** - A URL to transfer ownership of the deployment

### Project Packaging

The skill packages your project for deployment with the following behavior:

- **Excludes** `node_modules/` (dependencies are installed on Vercel)
- **Excludes** `.git/` directory
- **Excludes** files matching `.vercelignore` patterns
- **Includes** all other source files and configurations

## Usage

### Basic Deployment

Deploy a project with default settings:

**Input:**
```json
{
  "projectPath": "./my-app"
}
```

**Output:**
```markdown
# Deployment Successful

**Preview URL:** https://my-app-abc123.vercel.app
**Claim URL:** https://vercel.com/claim/abc123def456

Your deployment is live! Share the preview URL with stakeholders.
To claim ownership, visit the claim URL while signed into Vercel.
```

### Deployment with Options

Deploy with custom configuration:

**Input:**
```json
{
  "projectPath": "./my-app",
  "name": "my-awesome-project",
  "env": {
    "API_URL": "https://api.example.com",
    "NODE_ENV": "production"
  },
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Static HTML Deployment

Deploy a static HTML site (no package.json required):

**Input:**
```json
{
  "projectPath": "./static-site",
  "framework": "static"
}
```

## Parameters

### Required Parameters

- **projectPath** (string) - Path to the project directory to deploy

### Optional Parameters

- **name** (string) - Custom project name for the deployment
- **framework** (string) - Override auto-detected framework
- **buildCommand** (string) - Custom build command
- **outputDirectory** (string) - Custom output directory for built files
- **env** (object) - Environment variables for the deployment
- **regions** (string[]) - Deployment regions (default: auto)
- **public** (boolean) - Whether the deployment should be public (default: false)

## Deployment Process

### Step 1: Project Analysis

The skill analyzes your project:

1. Reads `package.json` to detect framework and dependencies
2. Checks for configuration files (`next.config.js`, `vite.config.ts`, etc.)
3. Determines optimal build settings

### Step 2: Packaging

The project is packaged for upload:

```
project/
├── package.json      ✓ Included
├── src/              ✓ Included
├── public/           ✓ Included
├── .env.local        ✓ Included (encrypted)
├── node_modules/     ✗ Excluded
└── .git/             ✗ Excluded
```

### Step 3: Deployment

The package is deployed to Vercel:

1. Files are uploaded to Vercel's infrastructure
2. Dependencies are installed
3. Build command is executed
4. Output is deployed to the edge network

### Step 4: Results

The skill returns:

- Preview URL for immediate access
- Claim URL for ownership transfer
- Build logs (if requested)
- Deployment metadata

## Framework-Specific Configuration

### Next.js

```json
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next"
}
```

**Auto-detected features:**
- API Routes
- Image Optimization
- ISR (Incremental Static Regeneration)
- Edge Functions

### Vite + React

```json
{
  "framework": "vite",
  "buildCommand": "vite build",
  "outputDirectory": "dist"
}
```

### SvelteKit

```json
{
  "framework": "sveltekit",
  "buildCommand": "vite build",
  "outputDirectory": ".svelte-kit"
}
```

## Environment Variables

### Setting Environment Variables

Pass environment variables for the deployment:

```json
{
  "projectPath": "./my-app",
  "env": {
    "DATABASE_URL": "postgres://...",
    "API_KEY": "secret_key_here",
    "NEXT_PUBLIC_API_URL": "https://api.example.com"
  }
}
```

### Environment Variable Types

| Prefix | Availability |
|--------|-------------|
| `NEXT_PUBLIC_` | Client + Server (Next.js) |
| `VITE_` | Client + Server (Vite) |
| No prefix | Server only |

## Claiming Deployments

After deployment, you receive a **Claim URL**. This allows:

1. **Ownership Transfer** - Take ownership of the deployment
2. **Custom Domain** - Add your own domain
3. **Team Integration** - Add to your Vercel team
4. **Analytics Access** - View deployment analytics

### Claim Process

1. Visit the claim URL
2. Sign in to Vercel (or create an account)
3. Choose to add to personal account or team
4. Optionally connect a Git repository

## Error Handling

### Common Errors

**Build Failed**
```
Error: Build command failed with exit code 1
Solution: Check build logs for specific errors
```

**Missing Dependencies**
```
Error: Cannot find module 'xyz'
Solution: Ensure all dependencies are in package.json
```

**Output Directory Not Found**
```
Error: Output directory 'dist' not found
Solution: Verify outputDirectory matches your build output
```

### Troubleshooting

1. **Check package.json** - Ensure all dependencies are listed
2. **Verify build command** - Test locally first
3. **Check environment variables** - Ensure required vars are set
4. **Review .vercelignore** - Make sure needed files aren't ignored

## Best Practices

### 1. Use Environment Variables for Secrets

Never hardcode sensitive data:

```json
{
  "env": {
    "API_KEY": "${process.env.API_KEY}"
  }
}
```

### 2. Optimize for Preview

For preview deployments:

- Use smaller datasets
- Enable development features
- Add watermarks if needed

### 3. Test Locally First

Before deploying:

```bash
# Build locally
npm run build

# Preview locally
npm run preview
```

### 4. Use Meaningful Names

```json
{
  "name": "feature-user-auth-v2"
}
```

## Integration Examples

### GitHub Actions

```yaml
name: Deploy Preview
on: [pull_request]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        run: npx vercel-deploy --project-path .
```

### Automated Testing

Deploy, test, then report:

```typescript
// Deploy
const deployment = await deploy({
  projectPath: './app',
  name: `test-${Date.now()}`
});

// Test
const response = await fetch(deployment.previewUrl);
expect(response.status).toBe(200);

// Report
console.log(`Preview: ${deployment.previewUrl}`);
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Framework Guides](https://vercel.com/docs/frameworks)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Examples

### Example 1: Deploy Next.js App

**Input:**
```json
{
  "projectPath": "./my-nextjs-app",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.example.com"
  }
}
```

**Output:**
```markdown
# Deployment Successful

**Framework:** Next.js 14.0.0
**Build Time:** 45s
**Preview URL:** https://my-nextjs-app-abc123.vercel.app
**Claim URL:** https://vercel.com/claim/xyz789

## Build Summary
- Pages: 12 static, 3 dynamic
- API Routes: 5
- Edge Functions: 2
- Total Size: 2.3 MB
```

### Example 2: Deploy Static Site

**Input:**
```json
{
  "projectPath": "./landing-page",
  "framework": "static"
}
```

**Output:**
```markdown
# Deployment Successful

**Framework:** Static HTML
**Build Time:** 5s
**Preview URL:** https://landing-page-def456.vercel.app
**Claim URL:** https://vercel.com/claim/abc123

## Deployment Info
- Files: 15
- Total Size: 450 KB
- CDN Regions: All
```
