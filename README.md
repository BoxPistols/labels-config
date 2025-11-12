# @boxpistols/labels-config

Terminal-first GitHub label management - Simple, fast, no token needed.

Manage GitHub labels from your terminal using gh CLI. No manual token setup required.

---

## Quick Start

```bash
# 1. Install gh CLI and authenticate (one-time setup)
brew install gh  # macOS
gh auth login

# 2. Install labels-config
npm install -g @boxpistols/labels-config

# 3. Initialize from template
labels-config init minimal --file labels.json

# 4. Sync to your repository
labels-config sync --owner your-name --repo your-repo --file labels.json
```

Done! Your labels are synced.

---

## Features

- **Terminal-First**: No token management - uses gh CLI authentication
- **Simple CLI**: 5 commands, straightforward usage
- **Pre-built Templates**: 9 ready-to-use label sets
- **Validation**: Check your config before syncing
- **Dry Run**: Preview changes before applying

---

## Installation

### Prerequisites

Install and authenticate gh CLI:

```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
sudo apt install gh

# Windows
winget install --id GitHub.cli

# Authenticate
gh auth login
```

### Install labels-config

```bash
npm install -g @boxpistols/labels-config
```

---

## Usage

### 1. Create label configuration

**From template:**
```bash
labels-config init minimal --file labels.json
```

**Available templates:**
- `minimal` - Basic 3-label set (bug, feature, documentation)
- `github` - GitHub standard labels
- `sdpf-ja` - Production project (Japanese)
- `sdpf-en` - Production project (English)
- `agile` - Agile/Scrum workflow
- `react`, `vue`, `frontend` - Framework-specific

### 2. Validate configuration

```bash
labels-config validate labels.json
```

### 3. Preview changes (dry run)

```bash
labels-config sync \
  --owner your-name \
  --repo your-repo \
  --file labels.json \
  --dry-run \
  --verbose
```

### 4. Sync to GitHub

**Append mode** (default - keeps existing labels):
```bash
labels-config sync --owner your-name --repo your-repo --file labels.json
```

**Replace mode** (removes unlisted labels):
```bash
labels-config sync --owner your-name --repo your-repo --file labels.json --delete-extra
```

### 5. Export existing labels

```bash
labels-config export --owner your-name --repo your-repo --file exported.json
```

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `init <template>` | Create label config from template |
| `validate <file>` | Validate label configuration |
| `sync` | Sync labels to GitHub |
| `export` | Export labels from GitHub |
| `help` | Show help |

### Options

| Option | Description |
|--------|-------------|
| `--owner <name>` | Repository owner |
| `--repo <name>` | Repository name |
| `--file <path>` | Config file path |
| `--dry-run` | Preview changes only |
| `--delete-extra` | Delete unlisted labels (replace mode) |
| `--verbose` | Show detailed output |

---

## Label Configuration Format

```json
{
  "version": "1.0.0",
  "labels": [
    {
      "name": "bug",
      "color": "d73a4a",
      "description": "Something isn't working"
    },
    {
      "name": "feature",
      "color": "0e8a16",
      "description": "New feature request"
    }
  ]
}
```

**Requirements:**
- `name`: 1-50 characters
- `color`: 3 or 6 character hex code (without #)
- `description`: 1-200 characters

---

## Sync Modes

### Append Mode (Default)
Adds new labels and updates existing ones. Keeps labels not in your config.

```bash
labels-config sync --owner user --repo repo --file labels.json
```

### Replace Mode
Deletes all labels not in your config. Complete control.

```bash
labels-config sync --owner user --repo repo --file labels.json --delete-extra
```

⚠️ **Warning**: Replace mode removes labels from all issues and PRs. Always use `--dry-run` first!

---

## Multi-Repository Sync

Sync the same labels to multiple repositories:

```bash
#!/bin/bash
REPOS=("org/repo1" "org/repo2" "org/repo3")

for REPO in "${REPOS[@]}"; do
  OWNER=$(echo $REPO | cut -d'/' -f1)
  REPO_NAME=$(echo $REPO | cut -d'/' -f2)

  labels-config sync \
    --owner $OWNER \
    --repo $REPO_NAME \
    --file labels.json \
    --verbose
done
```

---

## Workflow Integration

### GitHub Actions

```yaml
name: Sync Labels

on:
  push:
    paths:
      - 'labels.json'
    branches:
      - main

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
          sudo apt update
          sudo apt install gh -y

      - name: Authenticate gh CLI
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: echo "$GITHUB_TOKEN" | gh auth login --with-token

      - name: Sync labels
        run: |
          labels-config sync \
            --owner ${{ github.repository_owner }} \
            --repo ${{ github.event.repository.name }} \
            --file labels.json \
            --verbose
```

---

## Troubleshooting

### Authentication failed

```bash
# Check gh CLI status
gh auth status

# Re-authenticate
gh auth login

# Refresh authentication
gh auth refresh
```

### Validation errors

```bash
# Run validation to see specific errors
labels-config validate labels.json

# Common issues:
# - Duplicate label names
# - Invalid hex colors (must be 3 or 6 chars without #)
# - Name too long (max 50 chars)
# - Description too long (max 200 chars)
```

### Labels not syncing

```bash
# Check with verbose output
labels-config sync --owner user --repo repo --file labels.json --verbose

# Try dry run to see what would change
labels-config sync --owner user --repo repo --file labels.json --dry-run --verbose
```

### Rate limit exceeded

```bash
# Check rate limit status
gh api rate_limit

# Wait for reset (typically 60 minutes)
```

---

## Best Practices

**✅ DO:**
- Keep `labels.json` in version control
- Run `--dry-run` before actual sync
- Use semantic commit messages
- Document label purposes in your project
- Use consistent colors across projects

**❌ DON'T:**
- Delete labels without checking issue/PR usage
- Change label names frequently
- Skip validation before syncing

---

## Advanced Usage

### As npm Package

You can also use this as a library in your code:

```typescript
import { GitHubLabelSync } from '@boxpistols/labels-config/github'
import { CONFIG_TEMPLATES } from '@boxpistols/labels-config'

const sync = new GitHubLabelSync({
  owner: 'your-org',
  repo: 'your-repo'
})

const labels = CONFIG_TEMPLATES.minimal
await sync.syncLabels(labels)
```

Install in your project:
```bash
npm install @boxpistols/labels-config
```

---

## License

MIT

---

## Related

- [日本語 README](./README.ja.md)

---

**Made for terminal users who love gh CLI** 🚀
