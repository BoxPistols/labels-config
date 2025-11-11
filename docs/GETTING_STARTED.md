# Getting Started with @boxpistols/labels-config

## Installation

### npm

```bash
npm install @boxpistols/labels-config
```

### yarn

```bash
yarn add @boxpistols/labels-config
```

### pnpm

```bash
pnpm add @boxpistols/labels-config
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@boxpistols/labels-config/dist/index.umd.js"></script>
<script>
  const { validateLabels } = window.LabelsConfig
</script>
```

## Basic Usage

### Validate Labels

```typescript
import { validateLabels } from '@boxpistols/labels-config'

const labels = [
  {
    name: 'bug',
    color: 'ff0000',
    description: 'Something is broken'
  },
  {
    name: 'feature',
    color: '00ff00',
    description: 'New feature or request'
  }
]

// Validate labels
const validated = validateLabels(labels)
console.log(validated) // Returns validated and normalized labels
```

### Using Label Manager

```typescript
import { LabelManager } from '@boxpistols/labels-config'

const manager = new LabelManager({
  labels: [
    { name: 'bug', color: 'ff0000', description: 'Bug' },
    { name: 'feature', color: '00ff00', description: 'Feature' }
  ]
})

// Add a label
manager.addLabel({ name: 'docs', color: '0000ff', description: 'Documentation' })

// Get all labels
const allLabels = manager.getAllLabels()

// Search labels
const results = manager.search('feature')

// Export
const exported = manager.export()
const registry = manager.exportRegistry('1.0.0')
```

### GitHub Synchronization

```typescript
import { GitHubLabelSync } from '@boxpistols/labels-config/github'

const sync = new GitHubLabelSync({
  token: process.env.GITHUB_TOKEN,
  owner: 'your-org',
  repo: 'your-repo',
  verbose: true
})

// Sync local labels to GitHub
const result = await sync.syncLabels([
  { name: 'bug', color: 'ff0000', description: 'Bug' },
  { name: 'feature', color: '00ff00', description: 'Feature' }
])

console.log(`Created: ${result.created.length}`)
console.log(`Updated: ${result.updated.length}`)
console.log(`Deleted: ${result.deleted.length}`)
```

### Load Configuration from File

```typescript
import { ConfigLoader } from '@boxpistols/labels-config/config'
import { promises as fs } from 'fs'

const loader = new ConfigLoader()
const fileContent = await fs.readFile('labels.json', 'utf-8')
const labels = loader.loadFromString(fileContent)
```

### Using Templates

```typescript
import { CONFIG_TEMPLATES, listTemplates } from '@boxpistols/labels-config/config'

// Get SDPF template
const sdpfLabels = CONFIG_TEMPLATES.sdpf

// List all available templates
const templates = listTemplates() // ['minimal', 'github', 'sdpf', 'agile']

// Use GitHub standard template
const githubLabels = CONFIG_TEMPLATES.github
```

## CLI Usage

### Initialize Configuration

```bash
# Create from template
labels-config init sdpf --file labels.json

# Available templates: minimal, github, sdpf, agile
labels-config init github --file labels.json
```

### Validate Configuration

```bash
labels-config validate ./labels.json
```

### Sync to GitHub

```bash
labels-config sync \
  --token $GITHUB_TOKEN \
  --owner your-org \
  --repo your-repo \
  --file labels.json \
  --verbose
```

### Dry Run

```bash
# See what would be changed without actually changing
labels-config sync \
  --token $GITHUB_TOKEN \
  --owner your-org \
  --repo your-repo \
  --file labels.json \
  --dry-run \
  --verbose
```

### Export from Repository

```bash
# Export existing labels from GitHub
labels-config export \
  --token $GITHUB_TOKEN \
  --owner your-org \
  --repo your-repo \
  --file exported-labels.json
```

## Configuration File Format

### Flat List

```json
[
  {
    "name": "bug",
    "color": "ff0000",
    "description": "Something is broken"
  },
  {
    "name": "feature",
    "color": "00ff00",
    "description": "New feature"
  }
]
```

### Registry Format

```json
{
  "version": "1.0.0",
  "timestamp": "2024-11-12T00:00:00Z",
  "labels": [
    {
      "name": "bug",
      "color": "ff0000",
      "description": "Something is broken"
    }
  ],
  "metadata": {
    "project": "my-project"
  }
}
```

### Categorized Labels

```json
{
  "version": "1.0.0",
  "labels": [
    {
      "category": "Type",
      "labels": [
        {
          "name": "bug",
          "color": "ff0000",
          "description": "Bug fix"
        },
        {
          "name": "feature",
          "color": "00ff00",
          "description": "New feature"
        }
      ]
    },
    {
      "category": "Priority",
      "labels": [
        {
          "name": "priority:high",
          "color": "ff0000",
          "description": "High priority"
        }
      ]
    }
  ]
}
```

## Advanced Usage

### Error Handling

```typescript
import { validateWithDetails } from '@boxpistols/labels-config'

const result = validateWithDetails(data)

if (!result.valid) {
  console.log('Duplicate names:', result.errors.duplicateNames)
  console.log('Duplicate colors:', result.errors.duplicateColors)
  console.log('Validation errors:', result.errors.validationErrors)
}
```

### Custom Validation

```typescript
import { checkDuplicateNames, checkDuplicateColors } from '@boxpistols/labels-config'

const duplicateNames = checkDuplicateNames(labels)
const duplicateColors = checkDuplicateColors(labels)

if (duplicateNames.length > 0) {
  console.warn('Found duplicate label names:', duplicateNames)
}
```

### Search and Filter

```typescript
// Search by name or description
const results = manager.search('bug')

// Find by color
const redLabels = manager.findByColor('ff0000')

// Case-insensitive retrieval
const label = manager.getLabel('BUG') // Returns label named 'bug'
```

## Next Steps

- Read the [API documentation](./API.md)
- Check [examples](../examples)
- View [CLI documentation](./CLI.md)
- See [templates documentation](./TEMPLATES.md)
