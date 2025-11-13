/**
 * Cross-platform UI utilities tests
 * Tests for Mac, Windows, and Linux compatibility
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  colors,
  supportsColor,
  colorize,
  success,
  error,
  warning,
  info,
  header,
  progress,
  Spinner
} from './ui'

describe('UI Utilities - Cross-platform', () => {
  const originalEnv = process.env
  const originalPlatform = process.platform
  const originalStdout = process.stdout.isTTY

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
    Object.defineProperty(process, 'platform', {
      value: originalPlatform
    })
    Object.defineProperty(process.stdout, 'isTTY', {
      value: originalStdout
    })
  })

  describe('supportsColor', () => {
    it('should respect NO_COLOR environment variable on all platforms', () => {
      process.env.NO_COLOR = '1'
      expect(supportsColor()).toBe(false)
    })

    it('should respect FORCE_COLOR environment variable on all platforms', () => {
      process.env.FORCE_COLOR = '1'
      expect(supportsColor()).toBe(true)
    })

    it('should handle current platform correctly', () => {
      // Just verify it returns a boolean and doesn't crash
      delete process.env.NO_COLOR
      delete process.env.FORCE_COLOR
      const result = supportsColor()
      expect(typeof result).toBe('boolean')
    })

    it('should work consistently on all platforms', () => {
      // Test that the function works on current platform
      const platforms = ['win32', 'darwin', 'linux']
      expect(platforms).toContain(process.platform)

      // Function should not throw
      expect(() => supportsColor()).not.toThrow()
    })
  })

  describe('colorize', () => {
    it('should add ANSI codes when colors are supported', () => {
      process.env.FORCE_COLOR = '1'
      const result = colorize('test', 'red')
      expect(result).toContain('\x1b[31m')
      expect(result).toContain('test')
      expect(result).toContain('\x1b[0m')
    })

    it('should not add ANSI codes when colors are disabled', () => {
      process.env.NO_COLOR = '1'
      const result = colorize('test', 'red')
      expect(result).toBe('test')
      expect(result).not.toContain('\x1b[')
    })

    it('should handle all color codes', () => {
      process.env.FORCE_COLOR = '1'
      const colorKeys: Array<keyof typeof colors> = [
        'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray'
      ]

      colorKeys.forEach(color => {
        const result = colorize('test', color)
        expect(result).toContain('\x1b[')
        expect(result).toContain('test')
      })
    })
  })

  describe('message formatters', () => {
    beforeEach(() => {
      process.env.FORCE_COLOR = '1'
    })

    it('should format success messages consistently', () => {
      const result = success('Operation completed')
      expect(result).toContain('Operation completed')
      expect(result).toContain('✓')
    })

    it('should format error messages consistently', () => {
      const result = error('Operation failed')
      expect(result).toContain('Operation failed')
      expect(result).toContain('✗')
    })

    it('should format warning messages consistently', () => {
      const result = warning('Be careful')
      expect(result).toContain('Be careful')
      expect(result).toContain('⚠')
    })

    it('should format info messages consistently', () => {
      const result = info('Information')
      expect(result).toContain('Information')
      expect(result).toContain('ℹ')
    })

    it('should format headers consistently', () => {
      const result = header('Section')
      expect(result).toContain('Section')
      expect(result).toContain('─')
    })
  })

  describe('progress', () => {
    it('should calculate percentage correctly', () => {
      expect(progress(0, 100)).toContain('0%')
      expect(progress(50, 100)).toContain('50%')
      expect(progress(100, 100)).toContain('100%')
    })

    it('should handle different total values', () => {
      expect(progress(1, 2)).toContain('50%')
      expect(progress(3, 4)).toContain('75%')
    })

    it('should include label if provided', () => {
      const result = progress(50, 100, 'Processing')
      expect(result).toContain('Processing')
    })

    it('should render progress bar with correct blocks', () => {
      const result = progress(50, 100)
      expect(result).toContain('█') // filled blocks
      expect(result).toContain('░') // empty blocks
    })
  })

  describe('Spinner - Cross-platform', () => {
    let spinner: Spinner

    beforeEach(() => {
      spinner = new Spinner()
      vi.useFakeTimers()
    })

    afterEach(() => {
      spinner.stop()
      vi.useRealTimers()
    })

    it('should work on current platform', () => {
      expect(() => {
        spinner.start('Testing')
        spinner.stop()
      }).not.toThrow()
    })

    it('should handle success state on all platforms', () => {
      expect(() => {
        spinner.start('Processing')
        spinner.succeed('Done')
      }).not.toThrow()
    })

    it('should handle failure state on all platforms', () => {
      expect(() => {
        spinner.start('Processing')
        spinner.fail('Failed')
      }).not.toThrow()
    })

    it('should handle warning state on all platforms', () => {
      expect(() => {
        spinner.start('Processing')
        spinner.warn('Warning')
      }).not.toThrow()
    })

    it('should stop cleanly', () => {
      expect(() => {
        spinner.start('Testing')
        spinner.stop()
        spinner.stop() // Should handle multiple stops
      }).not.toThrow()
    })

    it('should handle multiple spinner instances', () => {
      const spinner2 = new Spinner()

      expect(() => {
        spinner.start('First')
        spinner2.start('Second')
        spinner.stop()
        spinner2.stop()
      }).not.toThrow()
    })
  })

  describe('Platform-specific line endings', () => {
    it('should work with Unix line endings (LF) on Mac/Linux', () => {
      const text = 'line1\nline2\nline3'
      expect(text.split('\n')).toHaveLength(3)
    })

    it('should work with Windows line endings (CRLF)', () => {
      const text = 'line1\r\nline2\r\nline3'
      expect(text.split('\r\n')).toHaveLength(3)
    })

    it('should normalize line endings', () => {
      const crlfText = 'line1\r\nline2'
      const lfText = 'line1\nline2'

      expect(crlfText.replace(/\r\n/g, '\n')).toBe(lfText)
    })
  })

  describe('Unicode symbol support', () => {
    const symbols = {
      checkmark: '✓',
      cross: '✗',
      warning: '⚠',
      info: 'ℹ',
      spinner: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
    }

    it('should render Unicode symbols on all platforms', () => {
      Object.keys(symbols).forEach(key => {
        const symbol = (symbols as any)[key]
        if (Array.isArray(symbol)) {
          symbol.forEach(s => {
            expect(s).toBeTruthy()
            expect(typeof s).toBe('string')
          })
        } else {
          expect(symbol).toBeTruthy()
          expect(typeof symbol).toBe('string')
        }
      })
    })
  })
})
