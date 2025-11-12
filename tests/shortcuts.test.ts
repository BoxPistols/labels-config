/**
 * Shortcuts System Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  ShortcutManager,
  ShortcutMatcher,
  createShortcutManager,
  getViewModeFromAction,
  SHORTCUTS
} from '../src/shortcuts'
import type { ShortcutAction } from '../src/shortcuts'

describe('ShortcutMatcher', () => {
  describe('matches', () => {
    it('should match simple key press', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' })
      const config = SHORTCUTS.CLEAR_SELECTION
      expect(ShortcutMatcher.matches(event, config)).toBe(true)
    })

    it('should match Ctrl+key combination', () => {
      const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true })
      const config = SHORTCUTS.SELECT_CATEGORY
      expect(ShortcutMatcher.matches(event, config)).toBe(true)
    })

    it('should match Ctrl+Shift+key combination', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'c',
        ctrlKey: true,
        shiftKey: true
      })
      const config = SHORTCUTS.ADD_CATEGORY
      expect(ShortcutMatcher.matches(event, config)).toBe(true)
    })

    it('should not match wrong key', () => {
      const event = new KeyboardEvent('keydown', { key: 'x', ctrlKey: true })
      const config = SHORTCUTS.SELECT_CATEGORY
      expect(ShortcutMatcher.matches(event, config)).toBe(false)
    })

    it('should not match wrong modifier', () => {
      const event = new KeyboardEvent('keydown', { key: 'c' })
      const config = SHORTCUTS.SELECT_CATEGORY
      expect(ShortcutMatcher.matches(event, config)).toBe(false)
    })
  })

  describe('findAction', () => {
    it('should find action for keyboard event', () => {
      const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true })
      const action = ShortcutMatcher.findAction(event)
      expect(action).toBe('SELECT_CATEGORY')
    })

    it('should return null for unmatched event', () => {
      const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true })
      const action = ShortcutMatcher.findAction(event)
      expect(action).toBeNull()
    })

    it('should find view mode actions', () => {
      const event1 = new KeyboardEvent('keydown', { key: '1', ctrlKey: true })
      expect(ShortcutMatcher.findAction(event1)).toBe('VIEW_LIST')

      const event2 = new KeyboardEvent('keydown', { key: '2', ctrlKey: true })
      expect(ShortcutMatcher.findAction(event2)).toBe('VIEW_CARD')

      const event3 = new KeyboardEvent('keydown', { key: '3', ctrlKey: true })
      expect(ShortcutMatcher.findAction(event3)).toBe('VIEW_TABLE')
    })
  })
})

describe('ShortcutManager', () => {
  let manager: ShortcutManager

  beforeEach(() => {
    manager = new ShortcutManager()
  })

  describe('Event Handling', () => {
    it('should register and trigger handler', () => {
      const handler = vi.fn()
      manager.on('SELECT_CATEGORY', handler)

      const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true })
      const handled = manager.handleEvent(event)

      expect(handled).toBe(true)
      expect(handler).toHaveBeenCalledWith('SELECT_CATEGORY')
    })

    it('should not trigger handler for unmatched event', () => {
      const handler = vi.fn()
      manager.on('SELECT_CATEGORY', handler)

      const event = new KeyboardEvent('keydown', { key: 'x', ctrlKey: true })
      const handled = manager.handleEvent(event)

      expect(handled).toBe(false)
      expect(handler).not.toHaveBeenCalled()
    })

    it('should trigger multiple handlers for same action', () => {
      const handler1 = vi.fn()
      const handler2 = vi.fn()

      manager.on('SELECT_CATEGORY', handler1)
      manager.on('SELECT_CATEGORY', handler2)

      const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true })
      manager.handleEvent(event)

      expect(handler1).toHaveBeenCalled()
      expect(handler2).toHaveBeenCalled()
    })

    it('should unsubscribe handler', () => {
      const handler = vi.fn()
      const unsubscribe = manager.on('SELECT_CATEGORY', handler)

      unsubscribe()

      const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true })
      manager.handleEvent(event)

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('Enable/Disable', () => {
    it('should start enabled', () => {
      expect(manager.isEnabled()).toBe(true)
    })

    it('should not handle events when disabled', () => {
      const handler = vi.fn()
      manager.on('SELECT_CATEGORY', handler)
      manager.disable()

      const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true })
      const handled = manager.handleEvent(event)

      expect(handled).toBe(false)
      expect(handler).not.toHaveBeenCalled()
    })

    it('should handle events when re-enabled', () => {
      const handler = vi.fn()
      manager.on('SELECT_CATEGORY', handler)
      manager.disable()
      manager.enable()

      const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true })
      const handled = manager.handleEvent(event)

      expect(handled).toBe(true)
      expect(handler).toHaveBeenCalled()
    })
  })

  describe('Clear', () => {
    it('should clear all handlers', () => {
      const handler = vi.fn()
      manager.on('SELECT_CATEGORY', handler)
      manager.clear()

      const event = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true })
      manager.handleEvent(event)

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('getShortcutList', () => {
    it('should return all shortcuts', () => {
      const shortcuts = manager.getShortcutList()
      expect(shortcuts.length).toBeGreaterThan(0)
      expect(shortcuts[0]).toHaveProperty('action')
      expect(shortcuts[0]).toHaveProperty('config')
    })
  })

  describe('formatShortcut', () => {
    it('should format simple shortcut', () => {
      const formatted = ShortcutManager.formatShortcut(SHORTCUTS.CLEAR_SELECTION)
      expect(formatted).toBe('ESCAPE')
    })

    it('should format Ctrl+key shortcut', () => {
      const formatted = ShortcutManager.formatShortcut(SHORTCUTS.SELECT_CATEGORY)
      expect(formatted).toBe('Ctrl+C')
    })

    it('should format Ctrl+Shift+key shortcut', () => {
      const formatted = ShortcutManager.formatShortcut(SHORTCUTS.ADD_CATEGORY)
      expect(formatted).toBe('Ctrl+Shift+C')
    })
  })
})

describe('Helper Functions', () => {
  describe('createShortcutManager', () => {
    it('should create a new instance', () => {
      const manager = createShortcutManager()
      expect(manager).toBeInstanceOf(ShortcutManager)
    })
  })

  describe('getViewModeFromAction', () => {
    it('should return list for VIEW_LIST action', () => {
      expect(getViewModeFromAction('VIEW_LIST')).toBe('list')
    })

    it('should return card for VIEW_CARD action', () => {
      expect(getViewModeFromAction('VIEW_CARD')).toBe('card')
    })

    it('should return table for VIEW_TABLE action', () => {
      expect(getViewModeFromAction('VIEW_TABLE')).toBe('table')
    })

    it('should return null for non-view actions', () => {
      expect(getViewModeFromAction('SELECT_CATEGORY')).toBeNull()
    })
  })
})

describe('SHORTCUTS Configuration', () => {
  it('should have SELECT_CATEGORY shortcut', () => {
    expect(SHORTCUTS.SELECT_CATEGORY).toEqual({
      key: 'c',
      ctrl: true,
      description: 'カテゴリーを選択'
    })
  })

  it('should have CLEAR_SELECTION shortcut', () => {
    expect(SHORTCUTS.CLEAR_SELECTION).toEqual({
      key: 'Escape',
      description: 'メモの選択を解除'
    })
  })

  it('should have view mode shortcuts', () => {
    expect(SHORTCUTS.VIEW_LIST).toEqual({
      key: '1',
      ctrl: true,
      description: 'リスト表示に切り替え'
    })

    expect(SHORTCUTS.VIEW_CARD).toEqual({
      key: '2',
      ctrl: true,
      description: 'カード表示に切り替え'
    })

    expect(SHORTCUTS.VIEW_TABLE).toEqual({
      key: '3',
      ctrl: true,
      description: 'テーブル表示に切り替え'
    })
  })
})
