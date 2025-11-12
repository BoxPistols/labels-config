# @boxpistols/labels-config

Terminal-first label management system for GitHub repositories using gh CLI - No token required.

Define, validate, and synchronize GitHub labels with a powerful schema-based configuration system. **Uses gh CLI authentication** - no need to manage GitHub tokens manually. Use 9 pre-built templates, define custom labels in TypeScript, or generate label configuration files.

**Use it as:**
- 📦 npm package in your code
- 🛠️ CLI tool to generate and validate label files
- 🔄 GitHub sync tool via gh CLI (no token needed - uses gh auth)

---

## 📑 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Detailed Usage Guide](#-detailed-usage-guide)
  - [Step 1: Installation and Setup](#step-1-installation-and-setup)
  - [Step 2: Choose a Template](#step-2-choose-a-template)
  - [Step 3: Customize Your Labels](#step-3-customize-your-labels)
  - [Step 4: Preview Changes (Dry Run)](#step-4-preview-changes-dry-run)
  - [Step 5: Sync to GitHub](#step-5-sync-to-github)
  - [Step 6: Export Existing Labels](#step-6-export-existing-labels)
- [Operational Update Manual](#-operational-update-manual)
- [Label Templates](#label-templates)
- [Sync Modes](#sync-modes)
- [Configuration Format](#configuration-format)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## Features

- **Terminal-First with gh CLI**: No token management - uses gh CLI authentication
- **9 Pre-built Templates**: Ready-to-use label sets for React, Vue, frontend, agile workflows, and more
- **Schema-Based Configuration**: Define labels with Zod validation
- **Type-Safe**: Full TypeScript support with auto-generated types
- **CLI Tool**: Command-line interface for label management
- **GitHub Integration via gh CLI**: Sync labels to GitHub repositories (no token required)
- **Multi-Format Distribution**: npm, ESM, UMD, and CDN support
- **Bilingual Support**: English and Japanese label templates (sdpf-en, sdpf-ja)

## Installation

### npm

```bash
npm install @boxpistols/labels-config
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@boxpistols/labels-config/dist/index.umd.js"></script>
```

## Quick Start

### Use Case 1: As npm Package (No GitHub Token Required)

Use pre-built templates or define custom labels in your code:

```typescript
import { CONFIG_TEMPLATES } from '@boxpistols/labels-config'

// Use pre-built templates
const reactLabels = CONFIG_TEMPLATES.react
const vueLabels = CONFIG_TEMPLATES.vue
const sdpfLabels = CONFIG_TEMPLATES['sdpf-ja']

// Access label properties
reactLabels.forEach(label => {
  console.log(`${label.name}: #${label.color}`)
})
```

Define custom labels with TypeScript:

```typescript
import { LabelConfig, validateLabels } from '@boxpistols/labels-config'

const customLabels: LabelConfig[] = [
  {
    name: 'bug',
    color: 'd73a4a',
    description: 'Something is not working'
  },
  {
    name: 'feature',
    color: '0e8a16',
    description: 'New feature or request'
  }
]

// Validate labels (checks format, duplicates, etc.)
const validated = validateLabels(customLabels)
```

### Use Case 2: CLI - Generate Label Files

```bash
# Generate label configuration from template
labels-config init react --file labels.json

# Validate your label configuration
labels-config validate labels.json
```

### Use Case 3: CLI - Sync to GitHub (uses gh CLI)

First, authenticate with gh CLI:

```bash
gh auth login
```

Then sync labels:

```bash
# Sync labels to GitHub (append mode - keeps existing labels)
labels-config sync --owner user --repo repo --file labels.json

# Sync labels to GitHub (replace mode - deletes unlisted labels)
labels-config sync --owner user --repo repo --file labels.json --delete-extra

# Export existing labels from GitHub
labels-config export --owner user --repo repo --file labels.json
```

### Use Case 4: Programmatic GitHub Sync (uses gh CLI)

```typescript
import { GitHubLabelSync } from '@boxpistols/labels-config/github'
import { CONFIG_TEMPLATES } from '@boxpistols/labels-config'

// No token needed - uses gh CLI authentication
const sync = new GitHubLabelSync({
  owner: 'your-org',
  repo: 'your-repo'
})

// Sync labels to repository
const labels = CONFIG_TEMPLATES.react
await sync.syncLabels(labels)
```

## Label Templates

This package includes 9 pre-built label templates, with a focus on frontend development:

### 1. **minimal** (3 labels)
Basic starter set with essential labels.

### 2. **github** (9 labels)
Standard GitHub default labels (bug, enhancement, documentation, etc.).

### 3. **react** (10 labels)
React ecosystem: components, hooks, state management, TypeScript, testing, styling, performance, accessibility.

### 4. **vue** (10 labels)
Vue.js ecosystem: components, composables, Pinia, Vue Router, TypeScript, testing, styling, performance, accessibility.

### 5. **frontend** (12 labels)
Framework-agnostic frontend development: features, UI/UX, responsive design, accessibility, SEO, build system, dependencies.

### 6. **sdpf-en** (14 labels, English)
Production project set with English labels for international teams.

### 7. **sdpf-ja** (14 labels, Japanese)
Production project set with Japanese labels for domestic development teams.

### 8. **sdpf** (14 labels, Japanese)
Alias for `sdpf-ja` - maintained for backward compatibility.

### 9. **agile** (10 labels)
Agile/Scrum workflow: stories, tasks, spikes, priorities, blockers.

### Usage

```typescript
import { CONFIG_TEMPLATES } from 'labels-config-boxpistols'

// Use a template
const reactLabels = CONFIG_TEMPLATES.react
const vueLabels = CONFIG_TEMPLATES.vue
const frontendLabels = CONFIG_TEMPLATES.frontend

// Choose language for SDPF
const sdpfEnglish = CONFIG_TEMPLATES['sdpf-en']
const sdpfJapanese = CONFIG_TEMPLATES['sdpf-ja']
// or use the default (Japanese)
const sdpfDefault = CONFIG_TEMPLATES.sdpf
```

## Sync Modes

When syncing labels to GitHub, you can choose between two modes:

### Append Mode (Default)
Adds new labels and updates existing ones, but keeps labels that aren't in your configuration.

```bash
labels-config sync --owner user --repo repo --file labels.json
```

### Replace Mode
Deletes all labels not in your configuration, giving you complete control.

```bash
labels-config sync --owner user --repo repo --file labels.json --delete-extra
```

**Recommendation**: Use append mode during initial setup, then switch to replace mode once you've finalized your label set.

## Configuration Format

Labels are defined as JSON or TypeScript objects:

```json
[
  {
    "name": "Component",
    "color": "008672",
    "description": "Component changes"
  },
  {
    "name": "Bug",
    "color": "ff0000",
    "description": "Bug fix"
  }
]
```

## 📚 Detailed Usage Guide

### Important: gh CLI Authentication

**gh CLI authentication is required for:**
- ✅ Syncing labels to GitHub repositories (`sync` command)
- ✅ Exporting labels from GitHub repositories (`export` command)

**gh CLI authentication is NOT required for:**
- ❌ Using as npm package in your code
- ❌ Generating label files from templates (`init` command)
- ❌ Validating label files (`validate` command)
- ❌ Defining and managing labels in TypeScript/JavaScript

**If you only want to use this package to define labels in your code, skip the gh CLI setup.**

### Step 1: Installation and Setup

#### 1.1 Install the package

**For CLI usage:**
```bash
npm install -g @boxpistols/labels-config
```

**For use as a library in your project:**
```bash
npm install @boxpistols/labels-config
```

**For development/CI:**
```bash
npm install --save-dev @boxpistols/labels-config
```

#### 1.2 Set up gh CLI (Optional - Only for sync/export)

**⚠️ Skip this step if you only use the package as a library or for generating label files.**

Install and authenticate with gh CLI:

**macOS:**
```bash
brew install gh
```

**Linux:**
```bash
# Debian/Ubuntu
sudo apt install gh

# Fedora/RHEL
sudo dnf install gh
```

**Windows:**
```bash
winget install --id GitHub.cli
```

**Authenticate:**
```bash
gh auth login
```

Follow the prompts to authenticate with your GitHub account. No need to manage tokens manually!

### Step 2: Choose a Template

#### 2.1 List available templates

```bash
labels-config help
```

Review the 9 available templates and choose one that fits your project:

- **minimal**: Simple projects with basic needs
- **github**: Standard GitHub workflow
- **react**: React-based frontend projects
- **vue**: Vue.js-based frontend projects
- **frontend**: General frontend projects (framework-agnostic)
- **sdpf-en**: Production projects (English labels)
- **sdpf-ja**: Production projects (Japanese labels)
- **agile**: Agile/Scrum development workflow

#### 2.2 Initialize from template

```bash
# For React projects
labels-config init react --file labels.json

# For Vue projects
labels-config init vue --file labels.json

# For general frontend projects
labels-config init frontend --file labels.json

# For production projects (Japanese)
labels-config init sdpf-ja --file labels.json

# For production projects (English)
labels-config init sdpf-en --file labels.json
```

### Step 3: Customize Your Labels

#### 3.1 Review the generated file

Open `labels.json` and review the labels:

```bash
cat labels.json
```

#### 3.2 Customize labels

Edit the JSON file to add, modify, or remove labels:

```json
{
  "version": "1.0.0",
  "timestamp": "2025-11-12T00:00:00.000Z",
  "labels": [
    {
      "name": "bug",
      "color": "d73a4a",
      "description": "Something isn't working"
    },
    {
      "name": "feature",
      "color": "0e8a16",
      "description": "New feature or request"
    }
  ]
}
```

**Label format requirements:**
- `name`: 1-50 characters, alphanumeric, hyphens, spaces, slashes (/, for CI/CD), Japanese characters
- `color`: 3 or 6 character hex code (without #)
- `description`: 1-200 characters

#### 3.3 Validate your configuration

Before syncing, always validate:

```bash
labels-config validate labels.json
```

This checks for:
- Valid hex colors
- Duplicate label names
- Proper JSON format
- Character limits

### Step 4: Preview Changes (Dry Run)

Before making changes to your GitHub repository, preview what will happen:

```bash
labels-config sync \
  --owner your-username \
  --repo your-repo \
  --file labels.json \
  --dry-run \
  --verbose
```

**What dry run shows:**
- Labels to be created (new)
- Labels to be updated (existing, with changes)
- Labels to be deleted (if using `--delete-extra`)
- Labels unchanged

### Step 5: Sync to GitHub

#### 5.1 First-time sync (Append Mode)

For the first sync, use append mode to keep existing labels:

```bash
labels-config sync \
  --owner your-username \
  --repo your-repo \
  --file labels.json \
  --verbose
```

This will:
- ✅ Add new labels from your config
- ✅ Update existing labels if colors/descriptions changed
- ✅ Keep labels not in your config

#### 5.2 Complete replacement (Replace Mode)

Once you're confident, use replace mode for complete control:

```bash
labels-config sync \
  --owner your-username \
  --repo your-repo \
  --file labels.json \
  --delete-extra \
  --verbose
```

This will:
- ✅ Add new labels from your config
- ✅ Update existing labels if colors/descriptions changed
- ❌ Delete labels NOT in your config

⚠️ **Warning**: Replace mode deletes labels. Always run with `--dry-run` first!

### Step 6: Export Existing Labels

To export current labels from a repository:

```bash
labels-config export \
  --owner your-username \
  --repo your-repo \
  --file exported-labels.json
```

Use this to:
- Backup existing labels
- Migrate labels between repositories
- Create a base for customization

## 🔄 Operational Update Manual

### Continuous Label Management

#### 1. Regular Maintenance Workflow

**Recommended workflow for ongoing label management:**

```bash
# 1. Keep your labels.json in version control
git add labels.json
git commit -m "Update label definitions"

# 2. Always validate before syncing
labels-config validate labels.json

# 3. Preview changes with dry run
labels-config sync --owner user --repo repo --file labels.json --dry-run --verbose

# 4. Apply changes
labels-config sync --owner user --repo repo --file labels.json --verbose
```

#### 2. Adding New Labels

To add a new label to your project:

1. **Edit labels.json:**

```json
{
  "labels": [
    // ... existing labels ...
    {
      "name": "security",
      "color": "ee0701",
      "description": "Security-related issues"
    }
  ]
}
```

2. **Validate the change:**

```bash
labels-config validate labels.json
```

3. **Preview and apply:**

```bash
# Dry run first
labels-config sync --owner user --repo repo --file labels.json --dry-run --verbose

# Apply changes
labels-config sync --owner user --repo repo --file labels.json --verbose
```

#### 3. Modifying Existing Labels

To update a label's color or description:

1. **Edit the label in labels.json**
2. **Validate and sync** (same as adding)

The sync will automatically update the existing label without affecting issues/PRs using that label.

#### 4. Removing Labels

**Option A: Safe removal (Append Mode)**
- Remove from labels.json
- Sync without `--delete-extra`
- Label remains in GitHub but won't be managed

**Option B: Complete removal (Replace Mode)**
```bash
# Remove from labels.json, then:
labels-config sync --owner user --repo repo --file labels.json --delete-extra --verbose
```

⚠️ **Warning**: Removing a label removes it from all issues and PRs using it!

#### 5. Multi-Repository Management

**Managing labels across multiple repositories:**

**Method 1: Script-based approach**

Create a sync script (`sync-labels.sh`):

```bash
#!/bin/bash

REPOS=(
  "org/repo1"
  "org/repo2"
  "org/repo3"
)

for REPO in "${REPOS[@]}"; do
  echo "Syncing labels to $REPO..."

  # Split org/repo
  OWNER=$(echo $REPO | cut -d'/' -f1)
  REPO_NAME=$(echo $REPO | cut -d'/' -f2)

  # Sync labels
  labels-config sync \
    --owner $OWNER \
    --repo $REPO_NAME \
    --file labels.json \
    --verbose

  echo "✓ Completed $REPO"
  echo "---"
done

echo "All repositories synced!"
```

Make it executable and run:

```bash
chmod +x sync-labels.sh
./sync-labels.sh
```

**Method 2: GitHub Actions (Automated)**

Create `.github/workflows/sync-labels.yml`:

```yaml
name: Sync Labels

on:
  push:
    paths:
      - 'labels.json'
    branches:
      - main
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install labels-config
        run: npm install -g @boxpistols/labels-config

      - name: Install gh CLI
        run: |
          type -p wget >/dev/null || (sudo apt update && sudo apt-get install wget -y)
          sudo mkdir -p -m 755 /etc/apt/keyrings
          wget -qO- https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null
          sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg
          echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
          sudo apt update
          sudo apt install gh -y

      - name: Authenticate gh CLI
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: echo "$GITHUB_TOKEN" | gh auth login --with-token

      - name: Validate labels
        run: labels-config validate labels.json

      - name: Sync labels
        run: |
          labels-config sync \
            --owner ${{ github.repository_owner }} \
            --repo ${{ github.event.repository.name }} \
            --file labels.json \
            --verbose
```

#### 6. Best Practices

**✅ DO:**
- Keep `labels.json` in version control
- Use semantic commit messages for label changes
- Run `--dry-run` before actual sync
- Document your label taxonomy in project README
- Review label usage regularly (remove unused labels)
- Use consistent color coding across projects

**❌ DON'T:**
- Delete labels without checking issue/PR usage
- Change label names frequently (breaks workflows)
- Use ambiguous or overlapping label meanings

#### 7. Team Collaboration

**For team-based label management:**

1. **Designate a label owner** - One person responsible for label definitions
2. **Use pull requests** - Review label changes like code
3. **Document label purposes** - Explain when to use each label
4. **Periodic review** - Quarterly review of label effectiveness
5. **Migration plan** - When renaming labels, provide migration guidance

**Example label documentation:**

```markdown
# Our Label System

## Priority Labels
- `priority:critical` (red) - Must be fixed immediately
- `priority:high` (orange) - Should be fixed this sprint
- `priority:medium` (yellow) - Should be fixed soon
- `priority:low` (green) - Can be deferred

## Type Labels
- `bug` - Something is broken
- `feature` - New functionality
- `refactor` - Code improvement without behavior change
```

#### 8. Migration from Other Systems

**From manual GitHub labels:**
```bash
# Export current labels
labels-config export --owner user --repo repo --file current.json

# Edit as needed
# Then sync back
labels-config sync --owner user --repo repo --file current.json
```

**From other label tools:**
- Export to JSON format matching our schema
- Validate before syncing
- Consider doing a test repository first

---

## Troubleshooting

### Problem: "Validation failed"

```bash
# Check for specific errors
labels-config validate labels.json

# Common issues:
# - Duplicate label names
# - Invalid hex colors (must be 3 or 6 chars)
# - Name too long (max 50 chars)
# - Description too long (max 200 chars)
```

### Problem: "Authentication failed"

```bash
# Check gh CLI authentication
gh auth status

# Re-authenticate if needed
gh auth login

# Refresh authentication
gh auth refresh
```

### Problem: "Label already exists"

- This is normal - the tool will update the existing label
- Use `--verbose` to see what changed

### Problem: "Labels not syncing"

```bash
# Try with maximum verbosity
labels-config sync \
  --owner user \
  --repo repo \
  --file labels.json \
  --verbose

# Check if dry-run shows the changes
labels-config sync --owner user --repo repo --file labels.json --dry-run --verbose
```

### Problem: "Rate limit exceeded"

- GitHub API has rate limits
- Check your rate limit: `gh api rate_limit`
- Wait 60 minutes for the limit to reset
- For bulk operations, add delays between syncs

---

## API Reference

### `LabelConfig`

```typescript
interface LabelConfig {
  name: string          // Label name (unique)
  color: string         // Hex color code (without #)
  description: string   // Human-readable description
}
```

### `validateLabels()`

Validates labels against the schema.

```typescript
function validateLabels(labels: unknown): LabelConfig[]
```

### `GitHubLabelSync`

Manages GitHub label synchronization.

```typescript
class GitHubLabelSync {
  constructor(options: GitHubSyncOptions)
  syncLabels(labels: LabelConfig[]): Promise<void>
  fetchLabels(): Promise<LabelConfig[]>
  deleteLabel(name: string): Promise<void>
  updateLabel(name: string, config: Partial<LabelConfig>): Promise<void>
}
```

## Contributing

Contributions are welcome! Please read our contributing guidelines.

---

## License

MIT

---

## Related Documentation

- [日本語 README](./README.ja.md)
- [Getting Started Guide](./docs/GETTING_STARTED.md)
- [API Documentation](./docs/API.md)
