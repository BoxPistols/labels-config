/**
 * Label List Component
 */

import React from 'react'
import { Box, Text } from 'ink'
import type { LabelConfig } from '../../types.js'

interface LabelListProps {
  labels: LabelConfig[]
  selectedIndex: number
  viewMode: 'list' | 'table'
}

export const LabelList: React.FC<LabelListProps> = ({
  labels,
  selectedIndex,
  viewMode
}) => {
  if (labels.length === 0) {
    return (
      <Box marginY={1}>
        <Text color="gray">ラベルがありません。'n' を押して新規作成してください。</Text>
      </Box>
    )
  }

  if (viewMode === 'table') {
    return (
      <Box flexDirection="column" marginY={1}>
        {/* ヘッダー */}
        <Box>
          <Box width={30}>
            <Text bold>Name</Text>
          </Box>
          <Box width={10}>
            <Text bold>Color</Text>
          </Box>
          <Box width={15}>
            <Text bold>Category</Text>
          </Box>
          <Box width="100%">
            <Text bold>Description</Text>
          </Box>
        </Box>

        {/* 区切り線 */}
        <Box>
          <Text color="gray">{'─'.repeat(80)}</Text>
        </Box>

        {/* ラベル一覧 */}
        {labels.map((label, index) => (
          <Box key={label.name}>
            <Box width={30}>
              <Text
                color={index === selectedIndex ? 'cyan' : 'white'}
                bold={index === selectedIndex}
              >
                {index === selectedIndex ? '▶ ' : '  '}
                {label.name}
              </Text>
            </Box>
            <Box width={10}>
              <Text color={`#${label.color}`}>#{label.color}</Text>
            </Box>
            <Box width={15}>
              <Text color="yellow">{label.category || '-'}</Text>
            </Box>
            <Box width="100%">
              <Text>{label.description}</Text>
            </Box>
          </Box>
        ))}
      </Box>
    )
  }

  // リスト表示
  return (
    <Box flexDirection="column" marginY={1}>
      {labels.map((label, index) => (
        <Box key={label.name} flexDirection="column" marginBottom={1}>
          <Box>
            <Text
              color={index === selectedIndex ? 'cyan' : 'white'}
              bold={index === selectedIndex}
            >
              {index === selectedIndex ? '▶ ' : '  '}
              {label.name}
            </Text>
            <Text color={`#${label.color}`}> [#{label.color}]</Text>
            {label.category && <Text color="yellow"> ({label.category})</Text>}
          </Box>
          <Box marginLeft={3}>
            <Text color="gray">{label.description}</Text>
          </Box>
          {label.memo && (
            <Box marginLeft={3}>
              <Text color="blue" italic>
                📝 {label.memo}
              </Text>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}
