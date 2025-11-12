# @boxpistols/labels-config

Comprehensive label management system for GitHub repositories and development teams.

Define, validate, and synchronize GitHub labels with a powerful schema-based configuration system. Supports npm package distribution and CDN delivery.

## Features

- **Schema-Based Configuration**: Define labels with Zod validation
- **GitHub Integration**: Sync labels to GitHub repositories
- **Type-Safe**: Full TypeScript support with auto-generated types
- **CLI Tool**: Command-line interface for label management
- **Multi-Format Distribution**: npm, ESM, UMD, and CDN support
- **Visualization**: React components for label display
- **Extensible**: Plugin system for custom label transformations

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

### Basic Usage

```typescript
import { LabelConfig, validateLabels, CONFIG_TEMPLATES } from '@boxpistols/labels-config'

// Use pre-built SDPF template
const labels = CONFIG_TEMPLATES.sdpf

// Or use custom labels
const customLabels: LabelConfig[] = [
  {
    name: 'API',
    color: 'ffb300',
    description: 'API・外部サービス連携'
  },
  {
    name: 'Component',
    color: '008672',
    description: 'Component変更'
  },
  {
    name: 'Bug',
    color: 'ff0000',
    description: 'バグ修正'
  },
  {
    name: 'Feature',
    color: '00ff00',
    description: '機能追加'
  }
]

// Validate labels
const validated = validateLabels(customLabels)
```

### GitHub Synchronization

```typescript
import { GitHubLabelSync } from '@boxpistols/labels-config/github'

const sync = new GitHubLabelSync({
  token: process.env.GITHUB_TOKEN,
  owner: 'your-org',
  repo: 'your-repo'
})

// Sync labels to repository
await sync.syncLabels(labels)
```

### CLI Usage

```bash
# Validate configuration
labels-config validate ./labels.json

# Initialize from template
labels-config init react --file ./labels.json

# Sync labels to GitHub (append mode - keeps existing labels)
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json

# Sync labels to GitHub (replace mode - deletes unlisted labels)
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json --delete-extra

# Generate configuration from repository
labels-config export --token $GITHUB_TOKEN --owner user --repo repo --output labels.json
```

## Label Templates

This package includes 7 pre-built label templates, with a focus on frontend development:

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

### 6. **sdpf** (19 labels)
Production project example from Smart Drone Platform Frontend.

### 7. **agile** (10 labels)
Agile/Scrum workflow: stories, tasks, spikes, priorities, blockers.

### Usage

```typescript
import { CONFIG_TEMPLATES } from '@boxpistols/labels-config'

// Use a template
const labels = CONFIG_TEMPLATES.react
const labels = CONFIG_TEMPLATES.vue
const labels = CONFIG_TEMPLATES.frontend
```

## Sync Modes

When syncing labels to GitHub, you can choose between two modes:

### Append Mode (Default)
Adds new labels and updates existing ones, but keeps labels that aren't in your configuration.

```bash
labels-config sync --token $TOKEN --owner user --repo repo --file labels.json
```

### Replace Mode
Deletes all labels not in your configuration, giving you complete control.

```bash
labels-config sync --token $TOKEN --owner user --repo repo --file labels.json --delete-extra
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

## License

MIT
