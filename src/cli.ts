#!/usr/bin/env node

/**
 * CLI Tool for Label Configuration Management
 * Command-line interface for managing GitHub labels
 */

import { promises as fs } from 'fs'
import { LabelManager } from './manager'
import { ConfigLoader } from './config/loader'
import { GitHubLabelSync } from './github/sync'
import { validateWithDetails } from './validation'
import { CONFIG_TEMPLATES, listTemplates } from './config/templates'
import { parseArgs, getRequiredOption, getOption, hasFlag, getPositional } from './utils/args'

const rawArgs = process.argv.slice(2)
const parsedArgs = parseArgs(rawArgs)

function printUsage(): void {
  console.log(`
labels-config CLI Tool - Terminal-first with gh CLI

Usage: labels-config <command> [options]

Commands:
  validate <file>                    Validate label configuration file
  sync                               Sync labels to GitHub repository (uses gh CLI)
  export <file>                      Export labels from GitHub repository (uses gh CLI)
  init <template>                    Initialize new configuration
  help                               Show this help message

Prerequisites:
  - gh CLI must be installed and authenticated (run: gh auth login)
  - No GitHub token required - uses gh CLI authentication

Options:
  --owner <owner>                    Repository owner (required for sync/export)
  --repo <repo>                      Repository name (required for sync/export)
  --file <file>                      Configuration file path
  --dry-run                          Dry run mode (don't make changes)
  --delete-extra                     Replace mode: delete existing labels not in config (default: append mode)
  --verbose                          Verbose output

Available Templates (9 types, frontend-focused):
  minimal                            Basic 3-label set (bug, feature, documentation)
  github                             GitHub standard labels
  react                              React ecosystem (components, hooks, state management)
  vue                                Vue.js ecosystem (composables, Pinia, router)
  frontend                           General frontend development (framework-agnostic)
  prod-en                            Production project (14 labels, English)
  prod-ja                            Production project (14 labels, Japanese)
  prod                               Production project (alias for prod-ja)
  agile                              Agile/Scrum workflow

Sync Modes:
  Default (append):                  Add new labels, update existing ones, keep others
  --delete-extra (replace):          Delete all existing labels and replace with config

Examples:
  # Setup gh CLI authentication first
  gh auth login

  # Validate configuration
  labels-config validate ./labels.json

  # Initialize from template
  labels-config init react --file ./labels.json

  # Sync labels (append mode - add/update, keep existing)
  labels-config sync --owner user --repo repo --file labels.json

  # Sync labels (replace mode - delete all, use only config)
  labels-config sync --owner user --repo repo --file labels.json --delete-extra

  # Dry run before syncing
  labels-config sync --owner user --repo repo --file labels.json --dry-run --verbose

  # Export labels from repository
  labels-config export --owner user --repo repo --file labels.json
`)
}

async function validateCommand(): Promise<void> {
  const file = getPositional(parsedArgs, 0)

  if (!file) {
    console.error('Error: File path required')
    console.error('Usage: labels-config validate <file>')
    process.exit(1)
  }

  try {
    // Check if file exists
    try {
      await fs.access(file)
    } catch {
      console.error(`Error: File not found: ${file}`)
      process.exit(1)
    }

    const content = await fs.readFile(file, 'utf-8')

    let data: unknown
    try {
      data = JSON.parse(content)
    } catch (error) {
      console.error(`Error: Invalid JSON in file: ${file}`)
      console.error(error instanceof Error ? error.message : String(error))
      process.exit(1)
    }

    const result = validateWithDetails(data)

    console.log(`\n✓ Validating: ${file}`)
    console.log(`Total labels: ${result.labels.length}`)

    if (result.valid) {
      console.log('✓ Configuration is valid')
      process.exit(0)
    } else {
      console.log('✗ Validation errors found:')
      const duplicateNames = (result.errors as any).duplicateNames
      if (duplicateNames && duplicateNames.length > 0) {
        console.log(`  - Duplicate names: ${duplicateNames.join(', ')}`)
      }
      const duplicateColors = (result.errors as any).duplicateColors
      if (duplicateColors && duplicateColors.length > 0) {
        console.log(`  - Duplicate colors: ${duplicateColors.join(', ')}`)
      }
      const validationErrors = (result.errors as any).validationErrors
      if (validationErrors && validationErrors.length > 0) {
        console.log('  - Validation errors:')
        validationErrors.forEach((err: any) => {
          console.log(`    ${err.path.join('.')}: ${err.message}`)
        })
      }
      process.exit(1)
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

async function syncCommand(): Promise<void> {
  try {
    const owner = getRequiredOption(parsedArgs, '--owner', 'Error: --owner is required for sync command')
    const repo = getRequiredOption(parsedArgs, '--repo', 'Error: --repo is required for sync command')
    const file = getRequiredOption(parsedArgs, '--file', 'Error: --file is required for sync command')
    const dryRun = hasFlag(parsedArgs, '--dry-run')
    const deleteExtra = hasFlag(parsedArgs, '--delete-extra')
    const verbose = hasFlag(parsedArgs, '--verbose')

    // Check if file exists
    try {
      await fs.access(file)
    } catch {
      console.error(`Error: File not found: ${file}`)
      process.exit(1)
    }

    const content = await fs.readFile(file, 'utf-8')

    let labels
    try {
      const loader = new ConfigLoader()
      labels = loader.loadFromString(content)
    } catch (error) {
      console.error(`Error: Failed to load labels from file: ${file}`)
      console.error(error instanceof Error ? error.message : String(error))
      process.exit(1)
    }

    const sync = new GitHubLabelSync({
      owner,
      repo,
      dryRun,
      deleteExtra,
      verbose
    })

    console.log(`\n${dryRun ? '[DRY RUN] ' : ''}Syncing labels to ${owner}/${repo}...`)
    const result = await sync.syncLabels(labels)

    console.log(`\nSync complete:`)
    console.log(`  Created: ${result.created.length}`)
    console.log(`  Updated: ${result.updated.length}`)
    console.log(`  Deleted: ${result.deleted.length}`)
    console.log(`  Unchanged: ${result.unchanged.length}`)

    if (result.errors.length > 0) {
      console.log(`\nErrors:`)
      result.errors.forEach((error) => {
        console.log(`  - ${error.name}: ${error.error}`)
      })
      process.exit(1)
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

async function exportCommand(): Promise<void> {
  try {
    const owner = getRequiredOption(parsedArgs, '--owner', 'Error: --owner is required for export command')
    const repo = getRequiredOption(parsedArgs, '--repo', 'Error: --repo is required for export command')
    const file = getOption(parsedArgs, '--file') || 'labels.json'

    const sync = new GitHubLabelSync({ owner, repo })
    const labels = await sync.fetchLabels()

    const manager = new LabelManager({ labels })
    const registry = manager.exportRegistry('1.0.0', { source: `${owner}/${repo}` })

    await fs.writeFile(file, JSON.stringify(registry, null, 2))
    console.log(`✓ Exported ${labels.length} labels to ${file}`)
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

async function initCommand(): Promise<void> {
  const template = getPositional(parsedArgs, 0)
  const file = getOption(parsedArgs, '--file') || 'labels.json'

  if (!template || !listTemplates().includes(template as any)) {
    console.log(`Error: Invalid template "${template || ''}"`)
    console.log(`Available templates: ${listTemplates().join(', ')}`)
    process.exit(1)
  }

  try {
    const labels = CONFIG_TEMPLATES[template as keyof typeof CONFIG_TEMPLATES]
    const manager = new LabelManager({ labels })
    const registry = manager.exportRegistry('1.0.0')

    await fs.writeFile(file, JSON.stringify(registry, null, 2))
    console.log(`✓ Created ${file} from template "${template}"`)
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

async function main(): Promise<void> {
  const command = parsedArgs.command

  if (!command || command === 'help' || hasFlag(parsedArgs, '--help', '-h')) {
    printUsage()
    return
  }

  switch (command) {
    case 'validate':
      await validateCommand()
      break
    case 'sync':
      await syncCommand()
      break
    case 'export':
      await exportCommand()
      break
    case 'init':
      await initCommand()
      break
    default:
      console.error(`Unknown command: ${command}`)
      printUsage()
      process.exit(1)
  }
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
