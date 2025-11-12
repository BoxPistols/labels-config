/**
 * State Management Tests
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  SelectionManager,
  CategoryManager,
  createSelectionManager
} from '../src/state'
import type { LabelConfig } from '../src/types'

describe('SelectionManager', () => {
  let manager: SelectionManager

  beforeEach(() => {
    manager = new SelectionManager()
  })

  describe('Category Selection', () => {
    it('should select a category', () => {
      manager.selectCategory('バグ')
      expect(manager.getSelectedCategory()).toBe('バグ')
    })

    it('should clear selected category', () => {
      manager.selectCategory('機能')
      manager.clearCategory()
      expect(manager.getSelectedCategory()).toBeNull()
    })

    it('should override previous category selection', () => {
      manager.selectCategory('バグ')
      manager.selectCategory('機能')
      expect(manager.getSelectedCategory()).toBe('機能')
    })
  })

  describe('Label Selection', () => {
    it('should select a label', () => {
      manager.selectLabel('test-label')
      expect(manager.isSelected('test-label')).toBe(true)
    })

    it('should deselect a label', () => {
      manager.selectLabel('test-label')
      manager.deselectLabel('test-label')
      expect(manager.isSelected('test-label')).toBe(false)
    })

    it('should select multiple labels', () => {
      manager.selectLabel('label1')
      manager.selectLabel('label2')
      expect(manager.getSelectedLabels()).toEqual(['label1', 'label2'])
    })

    it('should clear all selected labels', () => {
      manager.selectLabel('label1')
      manager.selectLabel('label2')
      manager.clearSelection()
      expect(manager.getSelectedLabels()).toEqual([])
    })
  })

  describe('View Mode', () => {
    it('should start with list view mode', () => {
      expect(manager.getViewMode()).toBe('list')
    })

    it('should change view mode to card', () => {
      manager.setViewMode('card')
      expect(manager.getViewMode()).toBe('card')
    })

    it('should change view mode to table', () => {
      manager.setViewMode('table')
      expect(manager.getViewMode()).toBe('table')
    })
  })

  describe('State Management', () => {
    it('should return full state snapshot', () => {
      manager.selectLabel('label1')
      manager.selectCategory('カテゴリ1')
      manager.setViewMode('card')

      const state = manager.getState()
      expect(state).toEqual({
        selectedLabels: ['label1'],
        selectedCategory: 'カテゴリ1',
        viewMode: 'card'
      })
    })

    it('should reset all state', () => {
      manager.selectLabel('label1')
      manager.selectCategory('カテゴリ1')
      manager.setViewMode('table')

      manager.reset()

      const state = manager.getState()
      expect(state).toEqual({
        selectedLabels: [],
        selectedCategory: null,
        viewMode: 'list'
      })
    })
  })

  describe('createSelectionManager', () => {
    it('should create a new instance', () => {
      const manager = createSelectionManager()
      expect(manager).toBeInstanceOf(SelectionManager)
    })
  })
})

describe('CategoryManager', () => {
  const testLabels: LabelConfig[] = [
    {
      name: 'bug',
      color: 'ff0000' as any,
      description: 'Bug report',
      category: 'バグ'
    },
    {
      name: 'feature',
      color: '00ff00' as any,
      description: 'New feature',
      category: '機能'
    },
    {
      name: 'docs',
      color: '0000ff' as any,
      description: 'Documentation',
      category: 'ドキュメント'
    },
    {
      name: 'other',
      color: 'ffff00' as any,
      description: 'Other'
    }
  ]

  describe('getCategories', () => {
    it('should extract unique categories', () => {
      const categories = CategoryManager.getCategories(testLabels)
      expect(categories).toEqual(['ドキュメント', 'バグ', '機能'])
    })

    it('should return empty array for uncategorized labels', () => {
      const labels: LabelConfig[] = [
        {
          name: 'test',
          color: 'ff0000' as any,
          description: 'Test'
        }
      ]
      const categories = CategoryManager.getCategories(labels)
      expect(categories).toEqual([])
    })
  })

  describe('filterByCategory', () => {
    it('should filter labels by category', () => {
      const filtered = CategoryManager.filterByCategory(testLabels, 'バグ')
      expect(filtered).toHaveLength(1)
      expect(filtered[0].name).toBe('bug')
    })

    it('should return all labels when category is null', () => {
      const filtered = CategoryManager.filterByCategory(testLabels, null)
      expect(filtered).toHaveLength(4)
    })
  })

  describe('groupByCategory', () => {
    it('should group labels by category', () => {
      const grouped = CategoryManager.groupByCategory(testLabels)
      expect(grouped).toHaveLength(4)
      expect(grouped[0].category).toBe('ドキュメント')
      expect(grouped[1].category).toBe('バグ')
      expect(grouped[2].category).toBe('機能')
      expect(grouped[3].category).toBe('その他')
    })

    it('should handle all categorized labels', () => {
      const categorized = testLabels.filter((l) => l.category)
      const grouped = CategoryManager.groupByCategory(categorized)
      expect(grouped).toHaveLength(3)
      expect(grouped.some((g) => g.category === 'その他')).toBe(false)
    })
  })

  describe('countByCategory', () => {
    it('should count labels per category', () => {
      const counts = CategoryManager.countByCategory(testLabels)
      expect(counts).toEqual({
        バグ: 1,
        機能: 1,
        ドキュメント: 1,
        その他: 1
      })
    })
  })

  describe('assignCategory', () => {
    it('should assign category to labels', () => {
      const updated = CategoryManager.assignCategory(
        testLabels,
        ['bug', 'feature'],
        '重要'
      )
      expect(updated[0].category).toBe('重要')
      expect(updated[1].category).toBe('重要')
      expect(updated[2].category).toBe('ドキュメント')
    })
  })

  describe('removeCategory', () => {
    it('should remove category from labels', () => {
      const updated = CategoryManager.removeCategory(testLabels, ['bug'])
      expect(updated[0].category).toBeUndefined()
      expect(updated[1].category).toBe('機能')
    })
  })
})
