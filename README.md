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
import { LabelConfig, validateLabels } from '@boxpistols/labels-config'

const labels: LabelConfig[] = [
  {
    name: 'API',
    color: 'ffb300',
    description: 'API related changes'
  },
  {
    name: 'Bug',
    color: 'ff0000',
    description: 'Something is broken'
  }
]

// Validate labels
const validated = validateLabels(labels)
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

# Sync labels to GitHub
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json

# Generate configuration from repository
labels-config export --token $GITHUB_TOKEN --owner user --repo repo --output labels.json
```

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
