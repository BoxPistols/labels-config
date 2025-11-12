/**
 * @boxpistols/labels-config
 * Comprehensive label management system for GitHub repositories
 */

export type { LabelConfig, LabelCategory, LabelRegistry, HexColor } from './types'
export { isCategorized, flattenLabels } from './types'

export { labelConfigSchema, labelRegistrySchema, labelCategorySchema } from './validation'
export {
  validateLabel,
  validateLabels,
  validateRegistry,
  validateWithDetails,
  checkDuplicateNames,
  checkDuplicateColors
} from './validation'

export { LabelManager } from './manager'
export type { LabelManagerOptions } from './manager'

export {
  SelectionManager,
  CategoryManager,
  createSelectionManager
} from './state'
export type { SelectionState, ViewMode } from './state'

export {
  ShortcutManager,
  ShortcutMatcher,
  createShortcutManager,
  getViewModeFromAction,
  attachShortcutManager,
  SHORTCUTS
} from './shortcuts'
export type { ShortcutConfig, ShortcutAction, ShortcutHandler } from './shortcuts'

export { version } from './version'

/**
 * Default export for CDN usage
 */
import { LabelManager } from './manager'
import { validateLabels, validateWithDetails } from './validation'
import { createSelectionManager } from './state'
import { createShortcutManager } from './shortcuts'
import { version } from './version'

export default {
  LabelManager,
  validateLabels,
  validateWithDetails,
  createSelectionManager,
  createShortcutManager,
  version
}
