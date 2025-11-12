/**
 * State Management for Label Selection and Category Operations
 * Provides utilities for managing selection state and category operations
 */

import type { LabelConfig, LabelCategory } from './types'

/**
 * Selection state for managing selected labels and categories
 */
export interface SelectionState {
  selectedLabels: Set<string> // Label names
  selectedCategory: string | null
  viewMode: ViewMode
}

/**
 * View modes for displaying labels
 */
export type ViewMode = 'list' | 'card' | 'table'

/**
 * State manager for label and category selection
 */
export class SelectionManager {
  private state: SelectionState

  constructor() {
    this.state = {
      selectedLabels: new Set(),
      selectedCategory: null,
      viewMode: 'list'
    }
  }

  /**
   * Select a category
   */
  selectCategory(category: string): void {
    this.state.selectedCategory = category
  }

  /**
   * Clear selected category
   */
  clearCategory(): void {
    this.state.selectedCategory = null
  }

  /**
   * Get currently selected category
   */
  getSelectedCategory(): string | null {
    return this.state.selectedCategory
  }

  /**
   * Select a label
   */
  selectLabel(labelName: string): void {
    this.state.selectedLabels.add(labelName)
  }

  /**
   * Deselect a label
   */
  deselectLabel(labelName: string): void {
    this.state.selectedLabels.delete(labelName)
  }

  /**
   * Clear all selected labels
   */
  clearSelection(): void {
    this.state.selectedLabels.clear()
  }

  /**
   * Check if a label is selected
   */
  isSelected(labelName: string): boolean {
    return this.state.selectedLabels.has(labelName)
  }

  /**
   * Get all selected labels
   */
  getSelectedLabels(): string[] {
    return Array.from(this.state.selectedLabels)
  }

  /**
   * Set view mode
   */
  setViewMode(mode: ViewMode): void {
    this.state.viewMode = mode
  }

  /**
   * Get current view mode
   */
  getViewMode(): ViewMode {
    return this.state.viewMode
  }

  /**
   * Get full state snapshot
   */
  getState(): Readonly<{
    selectedLabels: string[]
    selectedCategory: string | null
    viewMode: ViewMode
  }> {
    return {
      selectedLabels: this.getSelectedLabels(),
      selectedCategory: this.state.selectedCategory,
      viewMode: this.state.viewMode
    }
  }

  /**
   * Reset all state to initial values
   */
  reset(): void {
    this.state.selectedLabels.clear()
    this.state.selectedCategory = null
    this.state.viewMode = 'list'
  }
}

/**
 * Category utility functions
 */
export class CategoryManager {
  /**
   * Get all unique categories from labels
   */
  static getCategories(labels: LabelConfig[]): string[] {
    const categories = new Set<string>()
    labels.forEach((label) => {
      if (label.category) {
        categories.add(label.category)
      }
    })
    return Array.from(categories).sort()
  }

  /**
   * Filter labels by category
   */
  static filterByCategory(
    labels: LabelConfig[],
    category: string | null
  ): LabelConfig[] {
    if (!category) {
      return labels
    }
    return labels.filter((label) => label.category === category)
  }

  /**
   * Group labels by category
   */
  static groupByCategory(labels: LabelConfig[]): LabelCategory[] {
    const grouped = new Map<string, LabelConfig[]>()
    const uncategorized: LabelConfig[] = []

    labels.forEach((label) => {
      if (label.category) {
        const existing = grouped.get(label.category) || []
        existing.push(label)
        grouped.set(label.category, existing)
      } else {
        uncategorized.push(label)
      }
    })

    const result: LabelCategory[] = []

    // Add categorized labels
    Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([category, categoryLabels]) => {
        result.push({ category, labels: categoryLabels })
      })

    // Add uncategorized labels if any
    if (uncategorized.length > 0) {
      result.push({ category: 'その他', labels: uncategorized })
    }

    return result
  }

  /**
   * Count labels per category
   */
  static countByCategory(labels: LabelConfig[]): Record<string, number> {
    const counts: Record<string, number> = {}
    labels.forEach((label) => {
      const cat = label.category || 'その他'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }

  /**
   * Assign category to labels
   */
  static assignCategory(
    labels: LabelConfig[],
    labelNames: string[],
    category: string
  ): LabelConfig[] {
    return labels.map((label) => {
      if (labelNames.includes(label.name)) {
        return { ...label, category }
      }
      return label
    })
  }

  /**
   * Remove category from labels
   */
  static removeCategory(
    labels: LabelConfig[],
    labelNames: string[]
  ): LabelConfig[] {
    return labels.map((label) => {
      if (labelNames.includes(label.name)) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { category, ...rest } = label
        return rest as LabelConfig
      }
      return label
    })
  }
}

/**
 * Create a new selection manager instance
 */
export function createSelectionManager(): SelectionManager {
  return new SelectionManager()
}
