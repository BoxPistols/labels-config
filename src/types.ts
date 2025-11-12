/**
 * Label Configuration Types
 * Defines the structure and validation rules for labels
 */

export type HexColor = string & { readonly __brand: 'HexColor' }

export interface LabelConfig {
  /**
   * Unique identifier for the label
   * Used in GitHub as the label name
   */
  name: string

  /**
   * Hex color code (without # prefix)
   * Examples: 'ffb300', '008672', 'ff0000'
   */
  color: HexColor

  /**
   * Human-readable description
   * Displayed in GitHub and UI components
   */
  description: string

  /**
   * Optional memo/note field for additional information
   * Used for personal notes or additional context
   */
  memo?: string

  /**
   * Optional category assignment
   * Used to group labels by category
   */
  category?: string
}

export interface LabelCategory {
  /** Category name for grouping related labels */
  category: string

  /** Labels in this category */
  labels: LabelConfig[]
}

export interface LabelRegistry {
  /** Version of the label configuration */
  version: string

  /** Timestamp of last update */
  timestamp?: string

  /** All labels, optionally grouped by category */
  labels: LabelConfig[] | LabelCategory[]

  /** Custom metadata */
  metadata?: Record<string, unknown>
}

/**
 * Type guard for checking if labels are categorized
 */
export function isCategorized(
  labels: LabelConfig[] | LabelCategory[]
): labels is LabelCategory[] {
  return (
    Array.isArray(labels) &&
    labels.length > 0 &&
    'category' in labels[0] &&
    'labels' in labels[0]
  )
}

/**
 * Flatten categorized labels to a flat array
 */
export function flattenLabels(
  labels: LabelConfig[] | LabelCategory[]
): LabelConfig[] {
  if (isCategorized(labels)) {
    return labels.flatMap((cat) => cat.labels)
  }
  return labels
}
