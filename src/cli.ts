#!/usr/bin/env node

/**
 * CLI Tool for Label Configuration Management
 * Command-line interface for managing GitHub labels
 */

import { promises as fs } from 'fs'
import { LabelManager } from './manager'
import { ConfigLoader } from './config/loader'
import { BatchConfigLoader } from './config/batch-config'
import { GitHubLabelSync } from './github/sync'
import { BatchLabelSync } from './github/batch-sync'
import { validateWithDetails } from './validation'
import { CONFIG_TEMPLATES, listTemplates } from './config/templates'
import { parseArgs, getRequiredOption, getOption, hasFlag, getPositional } from './utils/args'
import { success, error, warning, info, header, colorize, Spinner } from './utils/ui'

const rawArgs = process.argv.slice(2)
const parsedArgs = parseArgs(rawArgs)

function printUsage(): void {
  console.log(colorize('\nlabels-config', 'bright') + ' - Terminal-first GitHub label management\n')

  console.log(header('Commands'))
  console.log('  ' + colorize('validate', 'cyan') + ' <file>           Validate label configuration file')
  console.log('  ' + colorize('sync', 'cyan') + '                     Sync labels to GitHub repository')
  console.log('  ' + colorize('batch-sync', 'cyan') + '               Sync labels to multiple repositories')
  console.log('  ' + colorize('batch-config', 'cyan') + ' <file>      Sync using batch configuration file')
  console.log('  ' + colorize('export', 'cyan') + '                   Export labels from GitHub repository')
  console.log('  ' + colorize('init', 'cyan') + ' <template>         Initialize new configuration')
  console.log('  ' + colorize('help', 'cyan') + '                     Show this help message')

  console.log(header('Prerequisites'))
  console.log('  ' + info('gh CLI must be installed and authenticated'))
  console.log('  Run: ' + colorize('gh auth login', 'yellow'))
  console.log('  No GitHub token required - uses gh CLI authentication')

  console.log(header('Options'))
  console.log('  ' + colorize('--owner', 'green') + ' <owner>         Repository owner (required for sync/export)')
  console.log('  ' + colorize('--repo', 'green') + ' <repo>          Repository name (required for sync/export)')
  console.log('  ' + colorize('--file', 'green') + ' <file>          Configuration file path')
  console.log('  ' + colorize('--template', 'green') + ' <name>       Template name (for batch-sync)')
  console.log('  ' + colorize('--org', 'green') + ' <org>            Organization name (for batch-sync)')
  console.log('  ' + colorize('--user', 'green') + ' <user>          User name (for batch-sync)')
  console.log('  ' + colorize('--repos', 'green') + ' <repos>        Comma-separated repository list')
  console.log('  ' + colorize('--parallel', 'green') + ' <num>       Number of parallel executions (default: 3)')
  console.log('  ' + colorize('--filter-lang', 'green') + ' <lang>   Filter by programming language')
  console.log('  ' + colorize('--filter-vis', 'green') + ' <vis>     Filter by visibility (public/private/all)')
  console.log('  ' + colorize('--dry-run', 'green') + '              Dry run mode (don\'t make changes)')
  console.log('  ' + colorize('--delete-extra', 'green') + '         Replace mode: delete labels not in config')
  console.log('  ' + colorize('--verbose', 'green') + '              Verbose output')

  console.log(header('Available Templates'))
  console.log('  ' + colorize('minimal', 'magenta') + '                Basic 3-label set (bug, feature, documentation)')
  console.log('  ' + colorize('github', 'magenta') + '                 GitHub standard labels')
  console.log('  ' + colorize('react', 'magenta') + '                  React ecosystem (components, hooks, state)')
  console.log('  ' + colorize('vue', 'magenta') + '                    Vue.js ecosystem (composables, Pinia, router)')
  console.log('  ' + colorize('frontend', 'magenta') + '               General frontend development')
  console.log('  ' + colorize('prod-en', 'magenta') + '                Production project (14 labels, English)')
  console.log('  ' + colorize('prod-ja', 'magenta') + '                Production project (14 labels, Japanese)')
  console.log('  ' + colorize('prod', 'magenta') + '                   Production project (alias for prod-ja)')
  console.log('  ' + colorize('agile', 'magenta') + '                  Agile/Scrum workflow')

  console.log(header('Examples'))
  console.log('  # Validate configuration')
  console.log('  ' + colorize('labels-config validate ./labels.json', 'gray'))
  console.log('')
  console.log('  # Initialize from template')
  console.log('  ' + colorize('labels-config init react --file ./labels.json', 'gray'))
  console.log('')
  console.log('  # Sync labels (append mode)')
  console.log('  ' + colorize('labels-config sync --owner user --repo repo --file labels.json', 'gray'))
  console.log('')
  console.log('  # Sync with dry run')
  console.log('  ' + colorize('labels-config sync --owner user --repo repo --file labels.json --dry-run', 'gray'))
  console.log('')
  console.log('  # Batch sync to all org repositories')
  console.log('  ' + colorize('labels-config batch-sync --org your-org --template prod-ja --dry-run', 'gray'))
  console.log('')
  console.log('  # Batch sync to specific repositories')
  console.log('  ' + colorize('labels-config batch-sync --repos your-org/repo1,your-org/repo2 --file labels.json', 'gray'))
  console.log('')
  console.log('  # Batch sync with filters')
  console.log('  ' + colorize('labels-config batch-sync --user your-username --template react --filter-lang TypeScript --filter-vis public', 'gray'))
  console.log('')
  console.log('  # Batch sync using config file')
  console.log('  ' + colorize('labels-config batch-config batch-config.json --dry-run', 'gray'))
  console.log('')
}

async function validateCommand(): Promise<void> {
  const file = getPositional(parsedArgs, 0)

  if (!file) {
    console.error(error('File path required'))
    console.error('Usage: labels-config validate <file>')
    process.exit(1)
  }

  const spinner = new Spinner()

  try {
    // Check if file exists
    try {
      await fs.access(file)
    } catch {
      console.error(error(`File not found: ${file}`))
      process.exit(1)
    }

    spinner.start(`Reading ${file}`)
    const content = await fs.readFile(file, 'utf-8')

    let data: unknown
    try {
      data = JSON.parse(content)
    } catch (err) {
      spinner.fail(`Invalid JSON in file: ${file}`)
      console.error(error(err instanceof Error ? err.message : String(err)))
      process.exit(1)
    }

    spinner.stop()
    spinner.start('Validating configuration')
    const result = validateWithDetails(data)

    spinner.stop()
    console.log(info(`Validating: ${file}`))
    console.log(info(`Total labels: ${result.labels.length}`))

    if (result.valid) {
      console.log(success('Configuration is valid!'))
      return
    } else {
      console.log(error('Validation errors found:'))
      const errors = result.errors as Partial<{
        duplicateNames: string[]
        duplicateColors: string[]
        validationErrors: Array<{ path: (string | number)[]; message: string }>
      }>

      if (errors.duplicateNames && errors.duplicateNames.length > 0) {
        console.log(colorize(`  • Duplicate names: ${errors.duplicateNames.join(', ')}`, 'red'))
      }
      if (errors.duplicateColors && errors.duplicateColors.length > 0) {
        console.log(colorize(`  • Duplicate colors: ${errors.duplicateColors.join(', ')}`, 'red'))
      }
      if (errors.validationErrors && errors.validationErrors.length > 0) {
        console.log(colorize('  • Validation errors:', 'red'))
        errors.validationErrors.forEach((err) => {
          console.log(`    ${err.path.join('.')}: ${err.message}`)
        })
      }
      process.exit(1)
    }
  } catch (err) {
    spinner.fail('Validation failed')
    console.error(error(err instanceof Error ? err.message : String(err)))
    process.exit(1)
  }
}

async function syncCommand(): Promise<void> {
  const spinner = new Spinner()

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
      console.error(error(`File not found: ${file}`))
      process.exit(1)
    }

    spinner.start(`Loading labels from ${file}`)
    const content = await fs.readFile(file, 'utf-8')

    let labels
    try {
      const loader = new ConfigLoader()
      labels = loader.loadFromString(content)
      spinner.succeed(`Loaded ${labels.length} labels`)
    } catch (err) {
      spinner.fail(`Failed to load labels from file: ${file}`)
      console.error(error(err instanceof Error ? err.message : String(err)))
      process.exit(1)
    }

    const sync = new GitHubLabelSync({
      owner,
      repo,
      dryRun,
      deleteExtra,
      verbose
    })

    const modeText = dryRun ? colorize('[DRY RUN]', 'yellow') : ''
    console.log(`\n${modeText} ${info(`Syncing to ${owner}/${repo}`)}`)
    if (deleteExtra) {
      console.log(warning('Replace mode: Will delete labels not in config'))
    }

    spinner.start('Syncing labels')
    const result = await sync.syncLabels(labels)
    spinner.succeed('Sync complete')

    console.log(header('Results'))
    if (result.created.length > 0) {
      console.log(success(`Created: ${result.created.length}`))
      if (verbose) {
        result.created.forEach(label => console.log(`  • ${label.name}`))
      }
    }
    if (result.updated.length > 0) {
      console.log(info(`Updated: ${result.updated.length}`))
      if (verbose) {
        result.updated.forEach(label => console.log(`  • ${label.name}`))
      }
    }
    if (result.deleted.length > 0) {
      console.log(warning(`Deleted: ${result.deleted.length}`))
      if (verbose) {
        result.deleted.forEach(name => console.log(`  • ${name}`))
      }
    }
    if (result.unchanged.length > 0) {
      console.log(colorize(`Unchanged: ${result.unchanged.length}`, 'gray'))
    }

    if (result.errors.length > 0) {
      console.log(header('Errors'))
      result.errors.forEach((err) => {
        console.log(error(`${err.name}: ${err.error}`))
      })
      process.exit(1)
    }
  } catch (err) {
    spinner.fail('Sync failed')
    console.error(error(err instanceof Error ? err.message : String(err)))
    process.exit(1)
  }
}

async function exportCommand(): Promise<void> {
  const spinner = new Spinner()

  try {
    const owner = getRequiredOption(parsedArgs, '--owner', 'Error: --owner is required for export command')
    const repo = getRequiredOption(parsedArgs, '--repo', 'Error: --repo is required for export command')
    const file = getOption(parsedArgs, '--file') || 'labels.json'

    spinner.start(`Fetching labels from ${owner}/${repo}`)
    const sync = new GitHubLabelSync({ owner, repo })
    const labels = await sync.fetchLabels()
    spinner.succeed(`Fetched ${labels.length} labels`)

    spinner.start('Creating registry')
    const manager = new LabelManager({ labels })
    const registry = manager.exportRegistry('1.0.0', { source: `${owner}/${repo}` })

    await fs.writeFile(file, JSON.stringify(registry, null, 2))
    spinner.succeed(`Exported to ${file}`)

    console.log(success(`Successfully exported ${labels.length} labels`))
  } catch (err) {
    spinner.fail('Export failed')
    console.error(error(err instanceof Error ? err.message : String(err)))
    process.exit(1)
  }
}

async function initCommand(): Promise<void> {
  const template = getPositional(parsedArgs, 0)
  const file = getOption(parsedArgs, '--file') || 'labels.json'

  if (!template || !listTemplates().includes(template as any)) {
    console.log(error(`Invalid template "${template || ''}"`))
    console.log(info('Available templates: ') + listTemplates().map(t => colorize(t, 'magenta')).join(', '))
    process.exit(1)
  }

  const spinner = new Spinner()

  try {
    spinner.start(`Creating configuration from "${template}" template`)
    const labels = CONFIG_TEMPLATES[template as keyof typeof CONFIG_TEMPLATES]
    const manager = new LabelManager({ labels })
    const registry = manager.exportRegistry('1.0.0')

    await fs.writeFile(file, JSON.stringify(registry, null, 2))
    spinner.succeed(`Created ${file}`)

    console.log(success(`Initialized with ${labels.length} labels from "${template}" template`))
    console.log(info('Next steps:'))
    console.log(`  1. Review and edit: ${colorize(file, 'cyan')}`)
    console.log(`  2. Validate: ${colorize(`labels-config validate ${file}`, 'gray')}`)
    console.log(`  3. Sync to repo: ${colorize(`labels-config sync --owner <owner> --repo <repo> --file ${file}`, 'gray')}`)
  } catch (err) {
    spinner.fail('Initialization failed')
    console.error(error(err instanceof Error ? err.message : String(err)))
    process.exit(1)
  }
}

async function batchSyncCommand(): Promise<void> {
  const spinner = new Spinner()

  try {
    // オプション解析
    const file = getOption(parsedArgs, '--file')
    const template = getOption(parsedArgs, '--template')
    const org = getOption(parsedArgs, '--org')
    const user = getOption(parsedArgs, '--user')
    const reposOption = getOption(parsedArgs, '--repos')
    const parallel = parseInt(getOption(parsedArgs, '--parallel') || '3')
    const filterLang = getOption(parsedArgs, '--filter-lang')
    const filterVis = getOption(parsedArgs, '--filter-vis')
    const dryRun = hasFlag(parsedArgs, '--dry-run')
    const deleteExtra = hasFlag(parsedArgs, '--delete-extra')

    // バリデーション: ラベルソースが指定されているか
    if (!file && !template) {
      console.error(error('Error: Either --file or --template is required for batch-sync'))
      console.log(info('Available templates: ') + listTemplates().map(t => colorize(t, 'magenta')).join(', '))
      process.exit(1)
    }

    // バリデーション: リポジトリターゲットが指定されているか
    if (!org && !user && !reposOption) {
      console.error(error('Error: One of --org, --user, or --repos is required'))
      console.log(info('Specify target repositories using:'))
      console.log('  --org <organization>  (sync all org repos)')
      console.log('  --user <username>     (sync all user repos)')
      console.log('  --repos owner/repo1,owner/repo2  (specific repos)')
      process.exit(1)
    }

    // ラベルの読み込み
    let labels: typeof CONFIG_TEMPLATES[keyof typeof CONFIG_TEMPLATES]
    if (file) {
      try {
        await fs.access(file)
      } catch {
        console.error(error(`File not found: ${file}`))
        process.exit(1)
      }

      spinner.start(`Loading labels from ${file}`)
      const content = await fs.readFile(file, 'utf-8')
      const loader = new ConfigLoader()
      labels = loader.loadFromString(content)
      spinner.succeed(`Loaded ${labels.length} labels from file`)
    } else if (template) {
      if (!listTemplates().includes(template as any)) {
        console.error(error(`Invalid template "${template}"`))
        console.log(info('Available templates: ') + listTemplates().map(t => colorize(t, 'magenta')).join(', '))
        process.exit(1)
      }
      spinner.start(`Loading "${template}" template`)
      labels = CONFIG_TEMPLATES[template as keyof typeof CONFIG_TEMPLATES]
      spinner.succeed(`Loaded ${labels.length} labels from "${template}" template`)
    } else {
      throw new Error('Either --file or --template is required')
    }

    // リポジトリリストの作成
    const repositories = reposOption ? reposOption.split(',').map(r => r.trim()) : undefined

    // バッチ同期の設定
    const batchSync = new BatchLabelSync()
    const options = {
      repositories,
      organization: org,
      user,
      template,
      mode: deleteExtra ? 'replace' as const : 'append' as const,
      dryRun,
      parallel,
      filter: {
        visibility: filterVis as 'public' | 'private' | 'all' | undefined,
        language: filterLang,
        archived: false
      }
    }

    const modeText = dryRun ? colorize('[DRY RUN] ', 'yellow') : ''
    console.log(`\n${modeText}${header('Batch Sync Configuration')}`)
    console.log(info(`Labels: ${labels.length}`))
    if (org) console.log(info(`Organization: ${org}`))
    if (user) console.log(info(`User: ${user}`))
    if (repositories) console.log(info(`Repositories: ${repositories.length} specified`))
    if (filterLang) console.log(info(`Filter (language): ${filterLang}`))
    if (filterVis) console.log(info(`Filter (visibility): ${filterVis}`))
    console.log(info(`Parallel: ${parallel}`))
    console.log(info(`Mode: ${deleteExtra ? 'replace' : 'append'}`))

    // バッチ同期の実行
    const results = await batchSync.syncMultiple(labels, options)

    // サマリー表示
    const summary = batchSync.generateSummary(results)
    console.log(summary)

    // エラーがある場合は終了コード1
    const hasErrors = results.some(r => r.status === 'failed')
    if (hasErrors) {
      process.exit(1)
    }
  } catch (err) {
    spinner.fail('Batch sync failed')
    console.error(error(err instanceof Error ? err.message : String(err)))
    process.exit(1)
  }
}

async function batchConfigCommand(): Promise<void> {
  const configFile = getPositional(parsedArgs, 0)
  const dryRun = hasFlag(parsedArgs, '--dry-run')
  const spinner = new Spinner()

  if (!configFile) {
    console.error(error('Configuration file path required'))
    console.error('Usage: labels-config batch-config <file>')
    console.log(info('Example: labels-config batch-config batch-config.json --dry-run'))
    process.exit(1)
  }

  try {
    // 設定ファイルの読み込み
    spinner.start(`Loading batch configuration from ${configFile}`)
    const config = await BatchConfigLoader.load(configFile)
    spinner.succeed(`Loaded batch configuration with ${config.targets.length} targets`)

    const modeText = dryRun ? colorize('[DRY RUN] ', 'yellow') : ''
    console.log(`\n${modeText}${header('Batch Configuration')}`)
    console.log(info(`Version: ${config.version}`))
    if (config.description) console.log(info(`Description: ${config.description}`))
    console.log(info(`Targets: ${config.targets.length}`))

    // 各ターゲットを処理
    let totalSuccess = 0
    let totalFailed = 0

    for (let i = 0; i < config.targets.length; i++) {
      const target = config.targets[i]
      console.log(`\n${header(`Target ${i + 1}/${config.targets.length}`)}`)

      // ラベルの読み込み
      let labels
      if (target.file) {
        spinner.start(`Loading labels from ${target.file}`)
        const content = await fs.readFile(target.file, 'utf-8')
        const loader = new ConfigLoader()
        labels = loader.loadFromString(content)
        spinner.succeed(`Loaded ${labels.length} labels`)
      } else if (target.template) {
        const templateName = target.template || config.defaults?.template
        if (!templateName || !listTemplates().includes(templateName as any)) {
          console.error(error(`Invalid template "${templateName}"`))
          continue
        }
        spinner.start(`Loading "${templateName}" template`)
        labels = CONFIG_TEMPLATES[templateName as keyof typeof CONFIG_TEMPLATES]
        spinner.succeed(`Loaded ${labels.length} labels`)
      } else {
        console.error(error('No template or file specified'))
        continue
      }

      // バッチ同期の実行
      const batchSync = new BatchLabelSync()
      const options = BatchConfigLoader.targetToOptions(target, config.defaults)
      options.dryRun = dryRun

      console.log(info(`Mode: ${options.mode}`))
      if (target.organization) console.log(info(`Organization: ${target.organization}`))
      if (target.user) console.log(info(`User: ${target.user}`))
      if (target.repositories) console.log(info(`Repositories: ${target.repositories.length}`))

      const results = await batchSync.syncMultiple(labels, options)

      // 結果の集計
      const successful = results.filter(r => r.status === 'success').length
      const failed = results.filter(r => r.status === 'failed').length

      totalSuccess += successful
      totalFailed += failed

      console.log(success(`Target ${i + 1}: ${successful} successful, ${failed} failed`))
    }

    // 全体サマリー
    console.log(`\n${header('Overall Summary')}`)
    console.log(success(`Total successful: ${totalSuccess}`))
    if (totalFailed > 0) {
      console.log(error(`Total failed: ${totalFailed}`))
      process.exit(1)
    }
  } catch (err) {
    spinner.fail('Batch config execution failed')
    console.error(error(err instanceof Error ? err.message : String(err)))
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
    case 'batch-sync':
      await batchSyncCommand()
      break
    case 'batch-config':
      await batchConfigCommand()
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
