import { describe, it, expect, beforeEach } from 'vitest'
import { LabelManager } from './manager'
import type { LabelConfig } from './types'

describe('LabelManager', () => {
  let manager: LabelManager
  const sampleLabels: LabelConfig[] = [
    { name: 'bug', color: 'ff0000', description: 'Bug fix' },
    { name: 'feature', color: '00ff00', description: 'New feature' },
    { name: 'docs', color: '0000ff', description: 'Documentation' }
  ]

  beforeEach(() => {
    manager = new LabelManager()
  })

  describe('constructor', () => {
    it('should initialize empty manager', () => {
      expect(manager.count()).toBe(0)
    })

    it('should load initial labels', () => {
      const mgr = new LabelManager({ labels: sampleLabels })
      expect(mgr.count()).toBe(3)
    })
  })

  describe('loadLabels', () => {
    it('should load labels', () => {
      manager.loadLabels(sampleLabels)
      expect(manager.count()).toBe(3)
    })

    it('should clear previous labels', () => {
      manager.loadLabels([sampleLabels[0]])
      expect(manager.count()).toBe(1)
      manager.loadLabels(sampleLabels)
      expect(manager.count()).toBe(3)
    })
  })

  describe('addLabel', () => {
    it('should add a new label', () => {
      const label: LabelConfig = { name: 'test', color: 'aabbcc', description: 'Test' }
      manager.addLabel(label)
      expect(manager.count()).toBe(1)
      expect(manager.hasLabel('test')).toBe(true)
    })

    it('should throw on duplicate names', () => {
      manager.addLabel(sampleLabels[0])
      expect(() => manager.addLabel(sampleLabels[0])).toThrow()
    })
  })

  describe('updateLabel', () => {
    beforeEach(() => {
      manager.loadLabels(sampleLabels)
    })

    it('should update an existing label', () => {
      manager.updateLabel('bug', { color: '00ff00' })
      const updated = manager.getLabel('bug')
      expect(updated?.color).toBe('00ff00')
    })

    it('should throw when label not found', () => {
      expect(() => manager.updateLabel('nonexistent', { color: 'aabbcc' })).toThrow()
    })
  })

  describe('removeLabel', () => {
    beforeEach(() => {
      manager.loadLabels(sampleLabels)
    })

    it('should remove a label', () => {
      manager.removeLabel('bug')
      expect(manager.hasLabel('bug')).toBe(false)
      expect(manager.count()).toBe(2)
    })

    it('should not throw for non-existent label', () => {
      expect(() => manager.removeLabel('nonexistent')).not.toThrow()
    })
  })

  describe('getLabel', () => {
    beforeEach(() => {
      manager.loadLabels(sampleLabels)
    })

    it('should get a label by name', () => {
      const label = manager.getLabel('bug')
      expect(label).toEqual(sampleLabels[0])
    })

    it('should return undefined for non-existent label', () => {
      expect(manager.getLabel('nonexistent')).toBeUndefined()
    })

    it('should be case-insensitive', () => {
      const label = manager.getLabel('BUG')
      expect(label).toEqual(sampleLabels[0])
    })
  })

  describe('search', () => {
    beforeEach(() => {
      manager.loadLabels(sampleLabels)
    })

    it('should search by name', () => {
      const results = manager.search('bug')
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('bug')
    })

    it('should search by description', () => {
      const results = manager.search('feature')
      expect(results).toHaveLength(1)
    })

    it('should be case-insensitive', () => {
      const results = manager.search('BUG')
      expect(results).toHaveLength(1)
    })
  })

  describe('export', () => {
    beforeEach(() => {
      manager.loadLabels(sampleLabels)
    })

    it('should export all labels', () => {
      const exported = manager.export()
      expect(exported).toHaveLength(3)
    })

    it('should export as registry', () => {
      const registry = manager.exportRegistry('1.0.0', { custom: 'data' })
      expect(registry.version).toBe('1.0.0')
      expect(registry.labels).toHaveLength(3)
      expect(registry.metadata?.custom).toBe('data')
    })
  })

  describe('validate', () => {
    it('should validate state', () => {
      manager.loadLabels(sampleLabels)
      const result = manager.validate()
      expect(result.valid).toBe(true)
      expect(result.duplicates).toHaveLength(0)
    })
  })
})
