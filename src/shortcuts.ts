/**
 * Keyboard Shortcuts System
 * Defines and manages keyboard shortcuts for label operations
 */

import type { ViewMode } from './state'

/**
 * Keyboard shortcut configuration
 */
export interface ShortcutConfig {
  key: string
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
  description: string
}

/**
 * Action types for shortcuts
 */
export type ShortcutAction =
  | 'SELECT_CATEGORY'
  | 'CLEAR_SELECTION'
  | 'VIEW_LIST'
  | 'VIEW_CARD'
  | 'VIEW_TABLE'
  | 'ADD_CATEGORY'
  | 'TOGGLE_MEMO'
  | 'SAVE'
  | 'CANCEL'

/**
 * Shortcut registry with default configurations
 */
export const SHORTCUTS: Record<ShortcutAction, ShortcutConfig> = {
  SELECT_CATEGORY: {
    key: 'c',
    ctrl: true,
    description: 'カテゴリーを選択'
  },
  CLEAR_SELECTION: {
    key: 'Escape',
    description: 'メモの選択を解除'
  },
  VIEW_LIST: {
    key: '1',
    ctrl: true,
    description: 'リスト表示に切り替え'
  },
  VIEW_CARD: {
    key: '2',
    ctrl: true,
    description: 'カード表示に切り替え'
  },
  VIEW_TABLE: {
    key: '3',
    ctrl: true,
    description: 'テーブル表示に切り替え'
  },
  ADD_CATEGORY: {
    key: 'c',
    ctrl: true,
    shift: true,
    description: 'カテゴリを追加'
  },
  TOGGLE_MEMO: {
    key: 'm',
    ctrl: true,
    description: 'メモの表示/非表示'
  },
  SAVE: {
    key: 's',
    ctrl: true,
    description: '保存'
  },
  CANCEL: {
    key: 'Escape',
    shift: true,
    description: 'キャンセル'
  }
}

/**
 * Shortcut handler callback type
 */
export type ShortcutHandler = (action: ShortcutAction) => void

/**
 * Keyboard event matcher
 */
export class ShortcutMatcher {
  /**
   * Check if keyboard event matches shortcut config
   */
  static matches(event: KeyboardEvent, config: ShortcutConfig): boolean {
    const keyMatch = event.key.toLowerCase() === config.key.toLowerCase()
    const ctrlMatch = !!config.ctrl === (event.ctrlKey || event.metaKey)
    const altMatch = !!config.alt === event.altKey
    const shiftMatch = !!config.shift === event.shiftKey
    const metaMatch =
      config.meta === undefined || !!config.meta === event.metaKey

    return keyMatch && ctrlMatch && altMatch && shiftMatch && metaMatch
  }

  /**
   * Find matching action for keyboard event
   */
  static findAction(event: KeyboardEvent): ShortcutAction | null {
    for (const [action, config] of Object.entries(SHORTCUTS)) {
      if (this.matches(event, config)) {
        return action as ShortcutAction
      }
    }
    return null
  }
}

/**
 * Shortcut manager for handling keyboard events
 */
export class ShortcutManager {
  private handlers: Map<ShortcutAction, ShortcutHandler[]>
  private enabled: boolean

  constructor() {
    this.handlers = new Map()
    this.enabled = true
  }

  /**
   * Register a handler for a specific action
   */
  on(action: ShortcutAction, handler: ShortcutHandler): () => void {
    const existing = this.handlers.get(action) || []
    existing.push(handler)
    this.handlers.set(action, existing)

    // Return unsubscribe function
    return () => {
      const current = this.handlers.get(action) || []
      const filtered = current.filter((h) => h !== handler)
      this.handlers.set(action, filtered)
    }
  }

  /**
   * Handle keyboard event
   */
  handleEvent(event: KeyboardEvent): boolean {
    if (!this.enabled) {
      return false
    }

    const action = ShortcutMatcher.findAction(event)
    if (!action) {
      return false
    }

    const handlers = this.handlers.get(action) || []
    if (handlers.length === 0) {
      return false
    }

    event.preventDefault()
    handlers.forEach((handler) => handler(action))
    return true
  }

  /**
   * Enable shortcut handling
   */
  enable(): void {
    this.enabled = true
  }

  /**
   * Disable shortcut handling
   */
  disable(): void {
    this.enabled = false
  }

  /**
   * Check if shortcuts are enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear()
  }

  /**
   * Get all registered shortcuts with descriptions
   */
  getShortcutList(): Array<{
    action: ShortcutAction
    config: ShortcutConfig
  }> {
    return Object.entries(SHORTCUTS).map(([action, config]) => ({
      action: action as ShortcutAction,
      config
    }))
  }

  /**
   * Format shortcut for display
   */
  static formatShortcut(config: ShortcutConfig): string {
    const parts: string[] = []

    if (config.ctrl) parts.push('Ctrl')
    if (config.alt) parts.push('Alt')
    if (config.shift) parts.push('Shift')
    if (config.meta) parts.push('Meta')

    parts.push(config.key.toUpperCase())

    return parts.join('+')
  }
}

/**
 * Create a new shortcut manager instance
 */
export function createShortcutManager(): ShortcutManager {
  return new ShortcutManager()
}

/**
 * Get view mode from shortcut action
 */
export function getViewModeFromAction(action: ShortcutAction): ViewMode | null {
  switch (action) {
    case 'VIEW_LIST':
      return 'list'
    case 'VIEW_CARD':
      return 'card'
    case 'VIEW_TABLE':
      return 'table'
    default:
      return null
  }
}

/**
 * Helper function to attach shortcut manager to window
 */
export function attachShortcutManager(
  manager: ShortcutManager,
  window: Window
): () => void {
  const listener = (event: KeyboardEvent) => {
    manager.handleEvent(event)
  }

  window.addEventListener('keydown', listener)

  // Return cleanup function
  return () => {
    window.removeEventListener('keydown', listener)
  }
}
