#!/usr/bin/env node
/**
 * Prepare build data script
 * This script builds the skills-kit package and generates build data files
 * Used by both predev and prebuild scripts
 */

import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🔨 Preparing build data...\n')

try {
  // Step 1: Build the skills-kit package
  console.log('📦 Building @repo/skills-kit...')
  execSync('pnpm --filter @repo/skills-kit build', {
    cwd: rootDir,
    stdio: 'inherit',
  })
  console.log('✓ Skills-kit package built successfully\n')

  // Step 2: Generate build data files
  console.log('📝 Generating build data files...')
  execSync('pnpm exec tsx scripts/generate-build-data.ts', {
    cwd: rootDir,
    stdio: 'inherit',
  })
  console.log('\n✓ Build data preparation complete!')
} catch (error) {
  console.error('\n❌ Error preparing build data:', error)
  process.exit(1)
}
