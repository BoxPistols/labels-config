# API Reference

## Types

### `LabelConfig`

Main label configuration interface.

```typescript
interface LabelConfig {
  name: string      // Label name (unique, 1-50 chars)
  color: HexColor   // Hex color code (6 digits)
  description: string  // Description (1-200 chars)
}
```

### `LabelRegistry`

Container for label collections with metadata.

```typescript
interface LabelRegistry {
  version: string
  timestamp?: string
  labels: LabelConfig[] | LabelCategory[]
  metadata?: Record<string, unknown>
}
```

### `LabelCategory`

Grouping mechanism for related labels.

```typescript
interface LabelCategory {
  category: string
  labels: LabelConfig[]
}
```

## Classes

### `LabelManager`

Main class for managing label configurations in memory.

#### Constructor

```typescript
new LabelManager(options?: LabelManagerOptions)
```

Options:
- `labels?: LabelConfig[]` - Initial labels to load
- `strict?: boolean` - Strict validation mode (default: false)

#### Methods

##### `loadLabels(labels: LabelConfig[]): void`

Load labels from array. Clears previous labels.

##### `loadRegistry(registry: LabelRegistry): void`

Load labels from registry object. Handles both flat and categorized formats.

##### `addLabel(label: LabelConfig): void`

Add a new label. Throws if name already exists.

##### `updateLabel(name: string, updates: Partial<LabelConfig>): void`

Update an existing label. Throws if label not found.

##### `removeLabel(name: string): void`

Remove a label by name.

##### `getLabel(name: string): LabelConfig | undefined`

Get a label by name. Case-insensitive.

##### `hasLabel(name: string): boolean`

Check if label exists. Case-insensitive.

##### `getAllLabels(): LabelConfig[]`

Get all labels as array.

##### `count(): number`

Get total number of labels.

##### `export(): LabelConfig[]`

Export all labels as array.

##### `exportRegistry(version?: string, metadata?: Record<string, unknown>): LabelRegistry`

Export as registry object with metadata.

##### `search(query: string): LabelConfig[]`

Search labels by name or description. Case-insensitive.

##### `findByColor(color: string): LabelConfig[]`

Find labels by color code. Case-insensitive.

##### `clear(): void`

Clear all labels.

##### `validate(): { valid: boolean; duplicates: string[] }`

Validate current state. Returns duplicate label names.

### `GitHubLabelSync`

Synchronize labels with GitHub repositories.

#### Constructor

```typescript
new GitHubLabelSync(options: GitHubSyncOptions)
```

Options:
- `token: string` - GitHub personal access token (required)
- `owner: string` - Repository owner (required)
- `repo: string` - Repository name (required)
- `dryRun?: boolean` - Dry run mode (default: false)
- `deleteExtra?: boolean` - Delete extra labels (default: false)
- `verbose?: boolean` - Verbose logging (default: false)

#### Methods

##### `async syncLabels(labels: LabelConfig[]): Promise<SyncResult>`

Sync local labels to GitHub repository.

Returns:
```typescript
interface SyncResult {
  created: LabelConfig[]
  updated: LabelConfig[]
  deleted: string[]
  unchanged: LabelConfig[]
  errors: Array<{ name: string; error: string }>
}
```

##### `async fetchLabels(): Promise<LabelConfig[]>`

Fetch all labels from GitHub repository.

##### `async deleteLabel(name: string): Promise<void>`

Delete a single label from repository.

##### `async updateLabel(name: string, updates: Partial<LabelConfig>): Promise<void>`

Update a single label in repository.

### `ConfigLoader`

Load configurations from various sources.

#### Constructor

```typescript
new ConfigLoader(options?: LoaderOptions)
```

Options:
- `strict?: boolean` - Strict validation mode (default: true)

#### Methods

##### `loadFromJSON(data: unknown): LabelConfig[]`

Load labels from JSON object or array.

##### `loadFromString(jsonString: string): LabelConfig[]`

Load labels from JSON string.

##### `loadRegistry(registry: LabelRegistry): LabelConfig[]`

Load labels from registry object.

## Functions

### Validation

#### `validateLabel(label: unknown): LabelConfig`

Validate and normalize a single label.

Throws: `ZodError` if validation fails.

#### `validateLabels(labels: unknown): LabelConfig[]`

Validate and normalize multiple labels.

Throws: `ZodError` if validation fails.

#### `validateRegistry(registry: unknown): LabelRegistry`

Validate complete registry object.

Throws: `ZodError` if validation fails.

#### `validateWithDetails(labels: unknown): ValidationResult`

Comprehensive validation with detailed error reporting.

```typescript
interface ValidationResult {
  valid: boolean
  labels: LabelConfig[]
  errors: {
    duplicateNames?: string[]
    duplicateColors?: string[]
    validationErrors?: ZodError[]
  }
}
```

#### `checkDuplicateNames(labels: LabelConfig[]): string[]`

Find duplicate label names.

#### `checkDuplicateColors(labels: LabelConfig[]): string[]`

Find duplicate colors.

### Type Guards

#### `isCategorized(labels: LabelConfig[] | LabelCategory[]): labels is LabelCategory[]`

Check if labels are categorized.

#### `flattenLabels(labels: LabelConfig[] | LabelCategory[]): LabelConfig[]`

Flatten categorized labels to flat array.

### Templates

#### `getTemplate(name: TemplateName): LabelConfig[]`

Get predefined template by name.

Templates:
- `minimal` - Minimal set for getting started
- `github` - GitHub standard labels
- `prod` - Production project labels (Japanese)
- `prod-en` - Production project labels (English)
- `prod-ja` - Production project labels (Japanese, alias)
- `react` - React ecosystem labels
- `vue` - Vue.js ecosystem labels
- `frontend` - General frontend development labels
- `agile` - Agile/Scrum labels

#### `listTemplates(): TemplateName[]`

List all available template names.

## Error Handling

All validation functions throw `ZodError` on invalid input:

```typescript
import { validateLabel } from '@boxpistols/labels-config'

try {
  validateLabel({ name: 'test', color: 'invalid' })
} catch (error) {
  if (error instanceof ZodError) {
    error.errors.forEach(err => {
      console.log(err.path, err.message)
    })
  }
}
```

## Strict Mode

When `strict: true` is passed to managers/loaders:
- All errors throw immediately
- No partial results are returned
- Validation is mandatory

When `strict: false`:
- Some errors are warnings
- Partial results may be returned
- Validation is optional

## Type Safety

All APIs are fully typed with TypeScript. No `any` types are used.

```typescript
// Full type inference
const manager = new LabelManager({ labels: [] })
const label = manager.getLabel('test') // Type: LabelConfig | undefined
const all = manager.getAllLabels()      // Type: LabelConfig[]
```
