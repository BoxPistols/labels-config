/**
 * Interactive CLI Application Main Component
 */

import React, { useState, useEffect } from 'react'
import { Box, Text, useInput, useApp } from 'ink'
import { LabelManager } from '../manager.js'
import { CategoryManager } from '../state.js'
import type { LabelConfig } from '../types.js'
import { LabelList } from './components/LabelList.js'
import { StatusBar } from './components/StatusBar.js'
import { HelpPanel } from './components/HelpPanel.js'
import { EditModal } from './components/EditModal.js'
import { CategorySelector } from './components/CategorySelector.js'

interface AppProps {
  configPath?: string
  manager: LabelManager
}

type ViewMode = 'list' | 'table'
type Screen = 'main' | 'edit' | 'category' | 'help'

export const App: React.FC<AppProps> = ({ configPath, manager }) => {
  const { exit } = useApp()
  const [labels, setLabels] = useState<LabelConfig[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [screen, setScreen] = useState<Screen>('main')
  const [showHelp, setShowHelp] = useState(false)
  const [message, setMessage] = useState<string>('')

  // ラベルを読み込む
  useEffect(() => {
    const allLabels = manager.getAllLabels()
    setLabels(allLabels)
  }, [manager])

  // フィルター済みラベルを取得
  const filteredLabels = selectedCategory
    ? CategoryManager.filterByCategory(labels, selectedCategory)
    : labels

  // カテゴリ一覧を取得
  const categories = CategoryManager.getCategories(labels)

  // 選択中のラベルを取得
  const selectedLabel = filteredLabels[selectedIndex] || null

  // キーボード入力ハンドラ
  useInput((input, key) => {
    // 編集モードやカテゴリ選択モードではメイン画面のショートカットを無効化
    if (screen !== 'main') {
      return
    }

    // ヘルプ表示中
    if (showHelp) {
      if (key.escape || input === 'h' || input === '?') {
        setShowHelp(false)
      }
      return
    }

    // 終了
    if (input === 'q' || (key.ctrl && input === 'c')) {
      exit()
      return
    }

    // ヘルプ表示
    if (input === 'h' || input === '?') {
      setShowHelp(true)
      return
    }

    // 上下移動
    if (key.upArrow || input === 'k') {
      setSelectedIndex((prev) => Math.max(0, prev - 1))
    } else if (key.downArrow || input === 'j') {
      setSelectedIndex((prev) => Math.min(filteredLabels.length - 1, prev + 1))
    }

    // カテゴリ選択
    if (input === 'c') {
      setScreen('category')
    }

    // カテゴリクリア
    if (key.escape && selectedCategory) {
      setSelectedCategory(null)
      setSelectedIndex(0)
      setMessage('カテゴリフィルタを解除しました')
      setTimeout(() => setMessage(''), 2000)
    }

    // 編集
    if (key.return && selectedLabel) {
      setScreen('edit')
    }

    // 新規作成
    if (input === 'n') {
      setScreen('edit')
    }

    // 削除
    if (input === 'd' && selectedLabel) {
      manager.removeLabel(selectedLabel.name)
      setLabels(manager.getAllLabels())
      setMessage(`${selectedLabel.name} を削除しました`)
      setTimeout(() => setMessage(''), 2000)
    }

    // 表示モード切り替え
    if (input === '1') {
      setViewMode('list')
    } else if (input === '2') {
      setViewMode('table')
    }

    // 保存
    if (input === 's') {
      if (configPath) {
        manager.export(configPath)
        setMessage(`${configPath} に保存しました`)
        setTimeout(() => setMessage(''), 2000)
      }
    }
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          📝 Labels Config Editor
        </Text>
        {selectedCategory && (
          <Text color="yellow"> [カテゴリ: {selectedCategory}]</Text>
        )}
      </Box>

      {showHelp ? (
        <HelpPanel />
      ) : screen === 'edit' ? (
        <EditModal
          label={selectedLabel}
          categories={categories}
          onSave={(label) => {
            if (selectedLabel) {
              manager.updateLabel(selectedLabel.name, label)
            } else {
              manager.addLabel(label)
            }
            setLabels(manager.getAllLabels())
            setScreen('main')
            setMessage(
              selectedLabel
                ? `${label.name} を更新しました`
                : `${label.name} を追加しました`
            )
            setTimeout(() => setMessage(''), 2000)
          }}
          onCancel={() => setScreen('main')}
        />
      ) : screen === 'category' ? (
        <CategorySelector
          categories={['すべて', ...categories]}
          onSelect={(category) => {
            setSelectedCategory(category === 'すべて' ? null : category)
            setSelectedIndex(0)
            setScreen('main')
            setMessage(
              category === 'すべて'
                ? 'すべてのラベルを表示'
                : `カテゴリ: ${category}`
            )
            setTimeout(() => setMessage(''), 2000)
          }}
          onCancel={() => setScreen('main')}
        />
      ) : (
        <LabelList
          labels={filteredLabels}
          selectedIndex={selectedIndex}
          viewMode={viewMode}
        />
      )}

      <StatusBar
        totalLabels={labels.length}
        filteredLabels={filteredLabels.length}
        selectedLabel={selectedLabel}
        viewMode={viewMode}
        message={message}
      />
    </Box>
  )
}
