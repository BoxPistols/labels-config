/**
 * Edit Modal Component
 */

import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import TextInput from 'ink-text-input'
import type { LabelConfig, HexColor } from '../../types.js'

interface EditModalProps {
  label: LabelConfig | null
  categories: string[]
  onSave: (label: LabelConfig) => void
  onCancel: () => void
}

type Field = 'name' | 'color' | 'description' | 'memo' | 'category'

export const EditModal: React.FC<EditModalProps> = ({
  label,
  categories,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState(label?.name || '')
  const [color, setColor] = useState(label?.color || '')
  const [description, setDescription] = useState(label?.description || '')
  const [memo, setMemo] = useState(label?.memo || '')
  const [category, setCategory] = useState(label?.category || '')
  const [currentField, setCurrentField] = useState<Field>('name')
  const [error, setError] = useState<string>('')

  const fields: Field[] = ['name', 'color', 'description', 'memo', 'category']

  useInput((input, key) => {
    // Tabで次のフィールドへ
    if (key.tab) {
      const currentIndex = fields.indexOf(currentField)
      const nextIndex = (currentIndex + 1) % fields.length
      setCurrentField(fields[nextIndex])
      setError('')
    }

    // Shift+Tabで前のフィールドへ
    if (key.shift && key.tab) {
      const currentIndex = fields.indexOf(currentField)
      const prevIndex = (currentIndex - 1 + fields.length) % fields.length
      setCurrentField(fields[prevIndex])
      setError('')
    }

    // Ctrl+Sで保存
    if (key.ctrl && input === 's') {
      handleSave()
    }

    // Escapeでキャンセル
    if (key.escape) {
      onCancel()
    }
  })

  const handleSave = () => {
    // バリデーション
    if (!name.trim()) {
      setError('Name is required')
      setCurrentField('name')
      return
    }

    if (!color.match(/^[0-9a-fA-F]{6}$/)) {
      setError('Color must be a 6-digit hex code (e.g., ff0000)')
      setCurrentField('color')
      return
    }

    if (!description.trim()) {
      setError('Description is required')
      setCurrentField('description')
      return
    }

    const newLabel: LabelConfig = {
      name: name.trim(),
      color: color.toLowerCase() as HexColor,
      description: description.trim(),
      ...(memo.trim() && { memo: memo.trim() }),
      ...(category.trim() && { category: category.trim() })
    }

    onSave(newLabel)
  }

  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor="cyan"
      padding={1}
    >
      <Box marginBottom={1}>
        <Text bold color="cyan">
          {label ? '✏️  Edit Label' : '➕ New Label'}
        </Text>
      </Box>

      {error && (
        <Box marginBottom={1}>
          <Text color="red">❌ {error}</Text>
        </Box>
      )}

      {/* Name */}
      <Box marginBottom={1}>
        <Box width={15}>
          <Text bold={currentField === 'name'} color={currentField === 'name' ? 'cyan' : 'white'}>
            Name:
          </Text>
        </Box>
        {currentField === 'name' ? (
          <TextInput
            value={name}
            onChange={setName}
            placeholder="e.g., bug, feature"
          />
        ) : (
          <Text>{name || <Text color="gray">(empty)</Text>}</Text>
        )}
      </Box>

      {/* Color */}
      <Box marginBottom={1}>
        <Box width={15}>
          <Text bold={currentField === 'color'} color={currentField === 'color' ? 'cyan' : 'white'}>
            Color:
          </Text>
        </Box>
        {currentField === 'color' ? (
          <TextInput
            value={color}
            onChange={setColor}
            placeholder="e.g., ff0000"
          />
        ) : (
          <Text>
            {color ? (
              <>
                #{color} <Text color={`#${color}`}>███</Text>
              </>
            ) : (
              <Text color="gray">(empty)</Text>
            )}
          </Text>
        )}
      </Box>

      {/* Description */}
      <Box marginBottom={1}>
        <Box width={15}>
          <Text bold={currentField === 'description'} color={currentField === 'description' ? 'cyan' : 'white'}>
            Description:
          </Text>
        </Box>
        {currentField === 'description' ? (
          <TextInput
            value={description}
            onChange={setDescription}
            placeholder="Describe the label"
          />
        ) : (
          <Text>{description || <Text color="gray">(empty)</Text>}</Text>
        )}
      </Box>

      {/* Memo */}
      <Box marginBottom={1}>
        <Box width={15}>
          <Text bold={currentField === 'memo'} color={currentField === 'memo' ? 'cyan' : 'white'}>
            Memo:
          </Text>
        </Box>
        {currentField === 'memo' ? (
          <TextInput
            value={memo}
            onChange={setMemo}
            placeholder="Optional note"
          />
        ) : (
          <Text>{memo || <Text color="gray">(optional)</Text>}</Text>
        )}
      </Box>

      {/* Category */}
      <Box marginBottom={1}>
        <Box width={15}>
          <Text bold={currentField === 'category'} color={currentField === 'category' ? 'cyan' : 'white'}>
            Category:
          </Text>
        </Box>
        {currentField === 'category' ? (
          <TextInput
            value={category}
            onChange={setCategory}
            placeholder="Optional category"
          />
        ) : (
          <Text>{category || <Text color="gray">(optional)</Text>}</Text>
        )}
      </Box>

      {categories.length > 0 && (
        <Box marginBottom={1}>
          <Text color="gray">
            Available categories: {categories.join(', ')}
          </Text>
        </Box>
      )}

      <Box marginTop={1}>
        <Text color="gray">
          [Tab] Next field [Shift+Tab] Previous [Ctrl+S] Save [Esc] Cancel
        </Text>
      </Box>
    </Box>
  )
}
