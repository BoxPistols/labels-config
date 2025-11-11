/**
 * Label Manager
 * Main class for managing label configurations
 */

import { LabelConfig, LabelRegistry, flattenLabels } from './types'
import { validateLabels, validateWithDetails, checkDuplicateNames } from './validation'

export interface LabelManagerOptions {
  /** Initial labels to load */
  labels?: LabelConfig[]

  /** Strict mode: fail on any validation error */
  strict?: boolean
}

export class LabelManager {
  private labels: Map<string, LabelConfig> = new Map()
  private strict: boolean = false

  constructor(options: LabelManagerOptions = {}) {
    this.strict = options.strict ?? false

    if (options.labels) {
      this.loadLabels(options.labels)
    }
  }

  /**
   * Load labels from array
   */
  loadLabels(labels: LabelConfig[]): void {
    const validation = validateWithDetails(labels)

    if (!validation.valid && this.strict) {
      throw new Error(`Label validation failed: ${JSON.stringify(validation.errors)}`)
    }

    this.labels.clear()
    validation.labels.forEach((label) => {
      this.labels.set(label.name.toLowerCase(), label)
    })
  }

  /**
   * Load labels from registry object
   */
  loadRegistry(registry: LabelRegistry): void {
    const labels = flattenLabels(registry.labels)
    this.loadLabels(labels)
  }

  /**
   * Add a single label
   */
  addLabel(label: LabelConfig): void {
    const validation = validateLabels([label])
    const newLabel = validation[0]

    if (this.labels.has(newLabel.name.toLowerCase())) {
      throw new Error(`Label "${newLabel.name}" already exists`)
    }

    this.labels.set(newLabel.name.toLowerCase(), newLabel)
  }

  /**
   * Update an existing label
   */
  updateLabel(name: string, updates: Partial<LabelConfig>): void {
    const key = name.toLowerCase()
    const existing = this.labels.get(key)

    if (!existing) {
      throw new Error(`Label "${name}" not found`)
    }

    const updated = { ...existing, ...updates }
    const validation = validateLabels([updated])
    this.labels.set(key, validation[0])
  }

  /**
   * Remove a label
   */
  removeLabel(name: string): void {
    this.labels.delete(name.toLowerCase())
  }

  /**
   * Get a label by name
   */
  getLabel(name: string): LabelConfig | undefined {
    return this.labels.get(name.toLowerCase())
  }

  /**
   * Check if label exists
   */
  hasLabel(name: string): boolean {
    return this.labels.has(name.toLowerCase())
  }

  /**
   * Get all labels
   */
  getAllLabels(): LabelConfig[] {
    return Array.from(this.labels.values())
  }

  /**
   * Get labels count
   */
  count(): number {
    return this.labels.size
  }

  /**
   * Export labels as array
   */
  export(): LabelConfig[] {
    return this.getAllLabels()
  }

  /**
   * Export as registry object
   */
  exportRegistry(version: string = '1.0.0', metadata?: Record<string, unknown>): LabelRegistry {
    return {
      version,
      timestamp: new Date().toISOString(),
      labels: this.getAllLabels(),
      metadata
    }
  }

  /**
   * Search labels by name or description
   */
  search(query: string): LabelConfig[] {
    const lowerQuery = query.toLowerCase()
    return this.getAllLabels().filter(
      (label) =>
        label.name.toLowerCase().includes(lowerQuery) ||
        label.description.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Find labels by color
   */
  findByColor(color: string): LabelConfig[] {
    const normalizedColor = color.toLowerCase()
    return this.getAllLabels().filter((label) => label.color.toLowerCase() === normalizedColor)
  }

  /**
   * Clear all labels
   */
  clear(): void {
    this.labels.clear()
  }

  /**
   * Validate current state
   */
  validate(): { valid: boolean; duplicates: string[] } {
    const labels = this.getAllLabels()
    const duplicates = checkDuplicateNames(labels)

    return {
      valid: duplicates.length === 0,
      duplicates
    }
  }
}
