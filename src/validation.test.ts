import { describe, it, expect } from 'vitest'
import {
  validateLabel,
  validateLabels,
  checkDuplicateNames,
  checkDuplicateColors,
  validateWithDetails
} from './validation'

describe('Label Validation', () => {
  describe('validateLabel', () => {
    it('should validate a correct label', () => {
      const label = {
        name: 'bug',
        color: 'ff0000',
        description: 'Something is broken'
      }
      expect(() => validateLabel(label)).not.toThrow()
      expect(validateLabel(label)).toEqual(label)
    })

    it('should reject invalid hex colors', () => {
      const label = {
        name: 'bug',
        color: 'invalid',
        description: 'Something is broken'
      }
      expect(() => validateLabel(label)).toThrow()
    })

    it('should accept 3-character hex colors', () => {
      const label = {
        name: 'test',
        color: 'f00',
        description: 'Test label'
      }
      const validated = validateLabel(label)
      expect(validated.color).toBe('ff0000')
    })

    it('should reject empty label names', () => {
      const label = {
        name: '',
        color: 'ff0000',
        description: 'Something is broken'
      }
      expect(() => validateLabel(label)).toThrow()
    })

    it('should support unicode characters in names', () => {
      const label = {
        name: 'バグ修正',
        color: 'ff0000',
        description: '不具合の修正'
      }
      expect(() => validateLabel(label)).not.toThrow()
    })
  })

  describe('validateLabels', () => {
    it('should validate multiple labels', () => {
      const labels = [
        {
          name: 'bug',
          color: 'ff0000',
          description: 'Something is broken'
        },
        {
          name: 'feature',
          color: '00ff00',
          description: 'New feature'
        }
      ]
      expect(() => validateLabels(labels)).not.toThrow()
      expect(validateLabels(labels)).toHaveLength(2)
    })

    it('should reject non-array input', () => {
      expect(() => validateLabels({ name: 'bug' })).toThrow()
    })
  })

  describe('checkDuplicateNames', () => {
    it('should detect duplicate names', () => {
      const labels = [
        { name: 'bug', color: 'ff0000', description: 'Bug' },
        { name: 'bug', color: '00ff00', description: 'Another bug' }
      ]
      const duplicates = checkDuplicateNames(labels)
      expect(duplicates).toContain('bug')
      expect(duplicates).toHaveLength(1)
    })

    it('should return empty array for unique names', () => {
      const labels = [
        { name: 'bug', color: 'ff0000', description: 'Bug' },
        { name: 'feature', color: '00ff00', description: 'Feature' }
      ]
      const duplicates = checkDuplicateNames(labels)
      expect(duplicates).toHaveLength(0)
    })
  })

  describe('checkDuplicateColors', () => {
    it('should detect duplicate colors', () => {
      const labels = [
        { name: 'bug', color: 'ff0000', description: 'Bug' },
        { name: 'error', color: 'ff0000', description: 'Error' }
      ]
      const duplicates = checkDuplicateColors(labels)
      expect(duplicates).toContain('ff0000')
    })

    it('should be case-insensitive', () => {
      const labels = [
        { name: 'bug', color: 'FF0000', description: 'Bug' },
        { name: 'error', color: 'ff0000', description: 'Error' }
      ]
      const duplicates = checkDuplicateColors(labels)
      expect(duplicates).toContain('ff0000')
    })
  })

  describe('validateWithDetails', () => {
    it('should return validation details', () => {
      const labels = [
        { name: 'bug', color: 'ff0000', description: 'Bug' },
        { name: 'feature', color: '00ff00', description: 'Feature' }
      ]
      const result = validateWithDetails(labels)
      expect(result.valid).toBe(true)
      expect(result.labels).toHaveLength(2)
      expect(result.errors.duplicateNames).toHaveLength(0)
    })

    it('should detect validation errors', () => {
      const labels = [
        { name: 'bug', color: 'invalid', description: 'Bug' }
      ]
      const result = validateWithDetails(labels)
      expect(result.valid).toBe(false)
      expect(result.errors).toHaveProperty('validationErrors')
    })
  })
})
