#!/usr/bin/env node

/**
 * CLI Tool for Label Configuration Management
 * Command-line interface for managing GitHub labels
 */

import { promises as fs } from 'fs'
import React from 'react'
import { render } from 'ink'
import { LabelManager } from './manager'
import { ConfigLoader } from './config/loader'
import { GitHubLabelSync } from './github/sync'
import { validateWithDetails } from './validation'
import { CONFIG_TEMPLATES, listTemplates } from './config/templates'
import { App } from './ui/App.js'

const args = process.argv.slice(2)
const command = args[0]

function printUsage(): void {
  console.log(`
labels-config CLI Tool

Usage: labels-config <command> [options]

Commands:
  edit [file]                        Open interactive label editor
  validate <file>                    Validate label configuration file
  sync                               Sync labels to GitHub repository
  export <file>                      Export labels from GitHub repository
  init <template>                    Initialize new configuration
  help                               Show this help message

Options:
  --token <token>                    GitHub personal access token (required for sync/export)
  --owner <owner>                    Repository owner (required for sync/export)
  --repo <repo>                      Repository name (required for sync/export)
  --file <file>                      Configuration file path
  --dry-run                          Dry run mode (don't make changes)
  --delete-extra                     Delete labels on GitHub not in config
  --verbose                          Verbose output

Examples:
  # Validate configuration
  labels-config validate ./labels.json

  # Initialize from template
  labels-config init sdpf --file ./labels.json

  # Sync labels to GitHub
  labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json

  # Dry run before syncing
  labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --dry-run --verbose
`)
}

async function validateCommand(): Promise<void> {
  const file = args[1]
  if (!file) {
    console.error('Error: File path required')
    process.exit(1)
  }

  try {
    const content = await fs.readFile(file, 'utf-8')
    const data = JSON.parse(content)
    const result = validateWithDetails(data)

    console.log(`\n✓ Validating: ${file}`)
    console.log(`Total labels: ${result.labels.length}`)

    if (result.valid) {
      console.log('✓ Configuration is valid')
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
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

async function syncCommand(): Promise<void> {
  const token = args[args.indexOf('--token') + 1]
  const owner = args[args.indexOf('--owner') + 1]
  const repo = args[args.indexOf('--repo') + 1]
  const file = args[args.indexOf('--file') + 1]
  const dryRun = args.includes('--dry-run')
  const deleteExtra = args.includes('--delete-extra')
  const verbose = args.includes('--verbose')

  if (!token || !owner || !repo || !file) {
    console.error('Error: --token, --owner, --repo, and --file are required')
    process.exit(1)
  }

  try {
    const content = await fs.readFile(file, 'utf-8')
    const loader = new ConfigLoader()
    const labels = loader.loadFromString(content)

    const sync = new GitHubLabelSync({
      token,
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
    }
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

async function exportCommand(): Promise<void> {
  const token = args[args.indexOf('--token') + 1]
  const owner = args[args.indexOf('--owner') + 1]
  const repo = args[args.indexOf('--repo') + 1]
  const file = args[args.indexOf('--file') + 1] || 'labels.json'

  if (!token || !owner || !repo) {
    console.error('Error: --token, --owner, and --repo are required')
    process.exit(1)
  }

  try {
    const sync = new GitHubLabelSync({ token, owner, repo })
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
  const template = args[1]
  const file = args[args.indexOf('--file') + 1] || 'labels.json'

  if (!template || !listTemplates().includes(template as any)) {
    console.log(`Error: Invalid template. Available templates: ${listTemplates().join(', ')}`)
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

async function editCommand(): Promise<void> {
  const file = args[1] || args[args.indexOf('--file') + 1] || './labels.json'

  let manager: LabelManager

  try {
    // 既存ファイルが存在する場合は読み込む
    const content = await fs.readFile(file, 'utf-8')
    const data = JSON.parse(content)
    const loader = new ConfigLoader()
    const labels = loader.loadFromJSON(data)
    manager = new LabelManager({ labels })
    console.log(`✓ Loaded ${labels.length} labels from ${file}`)
  } catch (error) {
    // ファイルが存在しない場合は新規作成
    console.log(`⚠ File not found. Creating new configuration...`)
    manager = new LabelManager()
  }

  // Inkアプリケーションをレンダリング
  render(React.createElement(App, { configPath: file, manager }))
}

async function main(): Promise<void> {
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    printUsage()
    return
  }

  switch (command) {
    case 'edit':
      await editCommand()
      break
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
