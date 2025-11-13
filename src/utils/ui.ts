/**
 * CLI UI Utilities
 * Cross-platform terminal formatting utilities
 */

/**
 * ANSI color codes - works on Mac, Windows (Windows 10+), and Linux
 */
export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
}

/**
 * Check if colors are supported
 * Respects NO_COLOR and FORCE_COLOR environment variables
 */
export function supportsColor(): boolean {
  // Respect NO_COLOR environment variable
  if (process.env.NO_COLOR) {
    return false
  }

  // Respect FORCE_COLOR environment variable
  if (process.env.FORCE_COLOR) {
    return true
  }

  // Check if stdout is a TTY
  if (!process.stdout.isTTY) {
    return false
  }

  // Windows 10+ supports ANSI colors
  if (process.platform === 'win32') {
    return true
  }

  // Unix-like systems generally support colors
  return true
}

/**
 * Colorize text if colors are supported
 */
export function colorize(text: string, color: keyof typeof colors): string {
  if (!supportsColor()) {
    return text
  }
  return `${colors[color]}${text}${colors.reset}`
}

/**
 * Format success message
 */
export function success(message: string): string {
  return colorize('✓', 'green') + ' ' + message
}

/**
 * Format error message
 */
export function error(message: string): string {
  return colorize('✗', 'red') + ' ' + message
}

/**
 * Format warning message
 */
export function warning(message: string): string {
  return colorize('⚠', 'yellow') + ' ' + message
}

/**
 * Format info message
 */
export function info(message: string): string {
  return colorize('ℹ', 'blue') + ' ' + message
}

/**
 * Format section header
 */
export function header(text: string): string {
  return '\n' + colorize(text, 'bright') + '\n' + '─'.repeat(Math.min(text.length, 50))
}

/**
 * Format progress indicator
 */
export function progress(current: number, total: number, label: string = ''): string {
  const percentage = Math.round((current / total) * 100)
  const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5))
  const suffix = label ? ` ${label}` : ''
  return `[${bar}] ${percentage}%${suffix}`
}

/**
 * Create a simple spinner for async operations
 */
export class Spinner {
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  private interval: NodeJS.Timeout | null = null
  private frameIndex = 0
  private message = ''

  start(message: string): void {
    this.message = message

    // Don't show spinner if not in TTY or colors are disabled
    if (!process.stdout.isTTY || !supportsColor()) {
      console.log(message + '...')
      return
    }

    this.interval = setInterval(() => {
      const frame = this.frames[this.frameIndex]
      process.stdout.write(`\r${colorize(frame, 'cyan')} ${this.message}`)
      this.frameIndex = (this.frameIndex + 1) % this.frames.length
    }, 80)
  }

  succeed(message?: string): void {
    this.stop()
    console.log(success(message || this.message))
  }

  fail(message?: string): void {
    this.stop()
    console.log(error(message || this.message))
  }

  warn(message?: string): void {
    this.stop()
    console.log(warning(message || this.message))
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
      if (process.stdout.isTTY) {
        process.stdout.write('\r\x1b[K') // Clear line
      }
    }
  }
}

/**
 * Format a table with aligned columns
 */
export function table(data: Array<Record<string, string | number>>): string {
  if (data.length === 0) return ''

  const headers = Object.keys(data[0])
  const columnWidths = headers.map(header => {
    const values = data.map(row => String(row[header]).length)
    return Math.max(header.length, ...values)
  })

  const formatRow = (row: Record<string, string | number>) => {
    return headers
      .map((header, i) => String(row[header]).padEnd(columnWidths[i]))
      .join('  ')
  }

  const headerRow = headers
    .map((header, i) => colorize(header.padEnd(columnWidths[i]), 'bright'))
    .join('  ')

  const separator = columnWidths.map(w => '─'.repeat(w)).join('  ')

  const rows = data.map(formatRow)

  return [headerRow, separator, ...rows].join('\n')
}
