import type { Plugin } from 'vite'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

export interface PrepareBuildPluginOptions {
  /** Skip building skills-kit package (useful if already built) */
  skipSkillsKitBuild?: boolean
  /** Fail fast on errors (default: false, will log but continue) */
  failOnError?: boolean
  /** Skip the plugin entirely */
  enabled?: boolean
}

/**
 * Vite plugin to prepare build data before dev or build
 * This runs the skills-kit build and generates search mapping files
 */
export function prepareBuildPlugin(options: PrepareBuildPluginOptions = {}): Plugin {
  const {
    skipSkillsKitBuild = false,
    failOnError = false,
    enabled = true,
  } = options

  let hasRun = false

  return {
    name: 'prepare-build',
    enforce: 'pre',
    buildStart() {
      // Skip if disabled
      if (!enabled) {
        return
      }

      // Only run once per build/dev session
      if (hasRun) {
        return
      }
      hasRun = true

      try {
        console.log('🔨 Preparing build data...\n')

        // Step 1: Build the skills-kit package (unless skipped)
        if (!skipSkillsKitBuild) {
          console.log('📦 Building @repo/skills-kit...')
          execSync('pnpm --filter @repo/skills-kit build', {
            cwd: rootDir,
            stdio: 'inherit',
          })
          console.log('✓ Skills-kit package built successfully\n')
        } else {
          console.log('⏭️  Skipping skills-kit build\n')
        }

        // Step 2: Generate build data files
        console.log('📝 Generating build data files...')
        execSync('pnpm exec tsx scripts/generate-build-data.ts', {
          cwd: rootDir,
          stdio: 'inherit',
        })
        console.log('✓ Build data preparation complete!\n')
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error('\n❌ Error preparing build data:', errorMessage)
        
        if (failOnError) {
          throw error
        }
        // Otherwise, log but continue - allows dev server to start even if build data fails
      }
    },
  }
}
