/**
 * Configuration Loader
 * Load label configurations from files and various sources
 */

import { LabelConfig, LabelRegistry } from '../types'
import { validateLabels } from '../validation'

export interface LoaderOptions {
  /** Strict validation mode */
  strict?: boolean
}

export class ConfigLoader {
  private strict: boolean

  constructor(options: LoaderOptions = {}) {
    this.strict = options.strict ?? true
  }

  /**
   * Load labels from JSON object
   */
  loadFromJSON(data: unknown): LabelConfig[] {
    // Handle both array and registry object
    if (
      typeof data === 'object' &&
      data !== null &&
      'labels' in data &&
      Array.isArray((data as any).labels)
    ) {
      const labels = (data as any).labels

      // Flatten if categorized
      if (labels.length > 0 && 'category' in labels[0]) {
        return labels.flatMap((cat: any) => cat.labels)
      }

      return validateLabels(labels)
    }

    return validateLabels(data)
  }

  /**
   * Load from JSON string
   */
  loadFromString(jsonString: string): LabelConfig[] {
    try {
      const data = JSON.parse(jsonString)
      return this.loadFromJSON(data)
    } catch (error) {
      throw new Error(
        `Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`
      )
    }
  }

  /**
   * Load from registry object
   */
  loadRegistry(registry: LabelRegistry): LabelConfig[] {
    return this.loadFromJSON({ labels: registry.labels })
  }
}
