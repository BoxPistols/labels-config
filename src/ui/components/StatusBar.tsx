/**
 * Status Bar Component
 */

import React from 'react'
import { Box, Text } from 'ink'
import type { LabelConfig } from '../../types.js'

interface StatusBarProps {
  totalLabels: number
  filteredLabels: number
  selectedLabel: LabelConfig | null
  viewMode: 'list' | 'table'
  message?: string
}

export const StatusBar: React.FC<StatusBarProps> = ({
  totalLabels,
  filteredLabels,
  selectedLabel,
  viewMode,
  message
}) => {
  return (
    <Box
      flexDirection="column"
      marginTop={1}
      borderStyle="single"
      borderColor="gray"
      paddingX={1}
    >
      {message && (
        <Box marginBottom={1}>
          <Text color="green">✓ {message}</Text>
        </Box>
      )}

      <Box justifyContent="space-between">
        <Box>
          <Text>
            Labels: {filteredLabels}/{totalLabels}
          </Text>
          {selectedLabel && (
            <Text color="gray"> | Selected: {selectedLabel.name}</Text>
          )}
        </Box>
        <Box>
          <Text color="gray">View: {viewMode === 'list' ? 'List' : 'Table'}</Text>
        </Box>
      </Box>

      <Box marginTop={1}>
        <Text color="gray">
          [h] Help [↑↓/jk] Navigate [Enter] Edit [n] New [d] Delete [c]
          Category [s] Save [q] Quit
        </Text>
      </Box>
    </Box>
  )
}
