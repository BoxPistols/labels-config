/**
 * Category Selector Component
 */

import React from 'react'
import { Box, Text } from 'ink'
import SelectInput from 'ink-select-input'

interface CategorySelectorProps {
  categories: string[]
  onSelect: (category: string) => void
  onCancel: () => void
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  onSelect
}) => {
  const items = categories.map((category) => ({
    label: category,
    value: category
  }))

  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor="yellow"
      padding={1}
    >
      <Box marginBottom={1}>
        <Text bold color="yellow">
          📁 Select Category
        </Text>
      </Box>

      <SelectInput items={items} onSelect={(item) => onSelect(item.value)} />

      <Box marginTop={1}>
        <Text color="gray">
          [↑↓] Navigate [Enter] Select [Esc] Cancel
        </Text>
      </Box>
    </Box>
  )
}
