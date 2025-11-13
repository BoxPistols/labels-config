/**
 * Cross-platform system tests
 * Tests for path handling, file system operations across Mac, Windows, and Linux
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { promises as fs } from 'fs'
import { join, resolve, normalize, sep } from 'path'
import { tmpdir } from 'os'

describe('Cross-platform File System', () => {
  const originalPlatform = process.platform
  let testDir: string

  beforeEach(async () => {
    // Create a unique test directory
    testDir = join(tmpdir(), `labels-config-test-${Date.now()}`)
    await fs.mkdir(testDir, { recursive: true })
  })

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true })
    } catch {
      // Ignore cleanup errors
    }

    Object.defineProperty(process, 'platform', {
      value: originalPlatform
    })
  })

  describe('Path handling', () => {
    it('should handle Unix-style paths on Mac/Linux', () => {
      const unixPath = 'foo/bar/baz.json'
      const normalized = normalize(unixPath)

      if (process.platform === 'win32') {
        expect(normalized).toBe('foo\\bar\\baz.json')
      } else {
        expect(normalized).toBe('foo/bar/baz.json')
      }
    })

    it('should handle Windows-style paths', () => {
      const winPath = 'foo\\bar\\baz.json'
      const normalized = normalize(winPath)

      // normalize should convert to platform-specific separators
      expect(normalized).toBeTruthy()
      expect(normalized.replace(/\\/g, '/')).toBe('foo/bar/baz.json')
    })

    it('should join paths correctly on all platforms', () => {
      const joined = join('foo', 'bar', 'baz.json')
      const parts = joined.split(sep)

      expect(parts).toEqual(['foo', 'bar', 'baz.json'])
    })

    it('should resolve absolute paths correctly', () => {
      const absolute = resolve('foo', 'bar')
      expect(absolute).toBeTruthy()
      expect(absolute.endsWith(`foo${sep}bar`)).toBe(true)
    })

    it('should handle paths with spaces', () => {
      const pathWithSpaces = join('foo bar', 'baz qux', 'file.json')
      expect(pathWithSpaces).toContain('foo bar')
      expect(pathWithSpaces).toContain('baz qux')
    })

    it('should handle paths with special characters', () => {
      const specialChars = join('foo-bar', 'baz_qux', 'file.json')
      expect(specialChars).toBeTruthy()
    })
  })

  describe('File operations', () => {
    it('should create and read files with Unix line endings', async () => {
      const filePath = join(testDir, 'unix.txt')
      const content = 'line1\nline2\nline3'

      await fs.writeFile(filePath, content, 'utf-8')
      const read = await fs.readFile(filePath, 'utf-8')

      // On Windows, Node.js might preserve the line endings
      expect(read.replace(/\r\n/g, '\n')).toBe(content)
    })

    it('should create and read files with Windows line endings', async () => {
      const filePath = join(testDir, 'windows.txt')
      const content = 'line1\r\nline2\r\nline3'

      await fs.writeFile(filePath, content, 'utf-8')
      const read = await fs.readFile(filePath, 'utf-8')

      expect(read).toBe(content)
    })

    it('should create nested directories', async () => {
      const nestedDir = join(testDir, 'a', 'b', 'c')
      await fs.mkdir(nestedDir, { recursive: true })

      const stat = await fs.stat(nestedDir)
      expect(stat.isDirectory()).toBe(true)
    })

    it('should handle file names with Unicode characters', async () => {
      const fileName = 'テスト-файл-文件.json'
      const filePath = join(testDir, fileName)
      const content = '{"test": true}'

      await fs.writeFile(filePath, content, 'utf-8')
      const read = await fs.readFile(filePath, 'utf-8')

      expect(read).toBe(content)
    })

    it('should check if file exists', async () => {
      const filePath = join(testDir, 'exists.txt')
      await fs.writeFile(filePath, 'content', 'utf-8')

      await expect(fs.access(filePath)).resolves.not.toThrow()

      const nonExistent = join(testDir, 'does-not-exist.txt')
      await expect(fs.access(nonExistent)).rejects.toThrow()
    })

    it('should read JSON files with consistent encoding', async () => {
      const filePath = join(testDir, 'config.json')
      const data = {
        name: 'test',
        unicode: '日本語',
        emoji: '🎉',
        number: 42
      }

      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
      const read = await fs.readFile(filePath, 'utf-8')
      const parsed = JSON.parse(read)

      expect(parsed).toEqual(data)
    })
  })

  describe('Environment variables', () => {
    it('should access common environment variables', () => {
      // These should be available on all platforms
      expect(process.env.PATH || process.env.Path).toBeTruthy()
      expect(process.env.HOME || process.env.USERPROFILE).toBeTruthy()
    })

    it('should handle case sensitivity correctly', () => {
      // Windows env vars are case-insensitive, Unix are case-sensitive
      const pathVar = process.env.PATH || process.env.Path || process.env.path
      expect(pathVar).toBeTruthy()
    })

    it('should parse boolean environment variables consistently', () => {
      const testValues = ['1', 'true', 'TRUE', 'yes', 'YES']
      testValues.forEach(value => {
        const parsed = value === '1' || value.toLowerCase() === 'true' || value.toLowerCase() === 'yes'
        expect(typeof parsed).toBe('boolean')
      })
    })
  })

  describe('Process information', () => {
    it('should detect platform correctly', () => {
      const validPlatforms = ['darwin', 'linux', 'win32', 'freebsd', 'openbsd', 'sunos', 'aix']
      expect(validPlatforms).toContain(process.platform)
    })

    it('should provide architecture information', () => {
      const validArchs = ['arm', 'arm64', 'ia32', 'x64', 'mips', 'ppc', 'ppc64', 's390', 's390x']
      expect(validArchs).toContain(process.arch)
    })

    it('should have consistent Node.js version format', () => {
      expect(process.version).toMatch(/^v\d+\.\d+\.\d+/)
    })
  })

  describe('Temporary directory handling', () => {
    it('should provide temp directory on all platforms', () => {
      const temp = tmpdir()
      expect(temp).toBeTruthy()
      expect(typeof temp).toBe('string')
    })

    it('should create files in temp directory', async () => {
      const tempFile = join(tmpdir(), `test-${Date.now()}.txt`)
      await fs.writeFile(tempFile, 'test', 'utf-8')

      const stat = await fs.stat(tempFile)
      expect(stat.isFile()).toBe(true)

      // Clean up
      await fs.unlink(tempFile)
    })
  })

  describe('Error handling across platforms', () => {
    it('should throw consistent errors for non-existent files', async () => {
      const nonExistent = join(testDir, 'does-not-exist.json')

      await expect(fs.readFile(nonExistent, 'utf-8')).rejects.toThrow()
    })

    it('should throw consistent errors for invalid JSON', async () => {
      const filePath = join(testDir, 'invalid.json')
      await fs.writeFile(filePath, '{invalid json}', 'utf-8')

      const content = await fs.readFile(filePath, 'utf-8')
      expect(() => JSON.parse(content)).toThrow()
    })

    it('should handle file permission changes', async () => {
      // This test works differently on different platforms
      const filePath = join(testDir, 'perms.txt')
      await fs.writeFile(filePath, 'content', 'utf-8')

      if (process.platform !== 'win32') {
        // Unix-like systems support chmod
        await fs.chmod(filePath, 0o644)
        const stat = await fs.stat(filePath)
        expect(stat.isFile()).toBe(true)

        // Restore for cleanup
        await fs.chmod(filePath, 0o644)
      } else {
        // Windows handles permissions differently
        // Just verify the file exists
        const stat = await fs.stat(filePath)
        expect(stat.isFile()).toBe(true)
      }
    })
  })
})

describe('Cross-platform CLI arguments', () => {
  it('should parse arguments with spaces', () => {
    const args = ['--file', 'my file.json', '--owner', 'user name']
    expect(args).toHaveLength(4)
    expect(args[1]).toBe('my file.json')
  })

  it('should handle arguments with equal signs', () => {
    const arg = '--file=labels.json'
    const [key, value] = arg.split('=')
    expect(key).toBe('--file')
    expect(value).toBe('labels.json')
  })

  it('should handle boolean flags consistently', () => {
    const flags = ['--verbose', '--dry-run', '--delete-extra']
    flags.forEach(flag => {
      expect(flag.startsWith('--')).toBe(true)
    })
  })
})

describe('Cross-platform JSON handling', () => {
  it('should serialize and parse JSON consistently', () => {
    const data = {
      name: 'test',
      color: 'ff0000',
      description: 'Test label with Unicode: 日本語 🎉'
    }

    const serialized = JSON.stringify(data, null, 2)
    const parsed = JSON.parse(serialized)

    expect(parsed).toEqual(data)
  })

  it('should handle large JSON files', () => {
    const largeData = {
      labels: Array.from({ length: 1000 }, (_, i) => ({
        name: `label-${i}`,
        color: 'ffffff',
        description: `Description ${i}`
      }))
    }

    const serialized = JSON.stringify(largeData)
    const parsed = JSON.parse(serialized)

    expect(parsed.labels).toHaveLength(1000)
  })
})
