/**
 * Help Panel Component
 */

import React from 'react'
import { Box, Text } from 'ink'

export const HelpPanel: React.FC = () => {
  return (
    <Box flexDirection="column" borderStyle="double" borderColor="cyan" padding={1}>
      <Box marginBottom={1}>
        <Text bold color="cyan">
          📖 Keyboard Shortcuts
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text bold>Navigation:</Text>
        <Text>  ↑ / k       - Move up</Text>
        <Text>  ↓ / j       - Move down</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text bold>Actions:</Text>
        <Text>  Enter       - Edit selected label</Text>
        <Text>  n           - Create new label</Text>
        <Text>  d           - Delete selected label</Text>
        <Text>  s           - Save to file</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text bold>View:</Text>
        <Text>  1           - List view</Text>
        <Text>  2           - Table view</Text>
        <Text>  c           - Select category</Text>
        <Text>  Esc         - Clear category filter</Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        <Text bold>Other:</Text>
        <Text>  h / ?       - Show/hide this help</Text>
        <Text>  q / Ctrl+C  - Quit application</Text>
      </Box>

      <Box marginTop={1}>
        <Text color="gray">Press 'h' or '?' to close this help panel</Text>
      </Box>
    </Box>
  )
}
