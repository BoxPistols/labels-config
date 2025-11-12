/**
 * Color utilities for hex color normalization
 */

/**
 * Normalizes a hex color to lowercase 6-digit format
 * @param input - Hex color string (3 or 6 characters, without # prefix)
 * @returns Normalized hex color in lowercase 6-digit format
 * @example
 * normalizeHexColor('f00') => 'ff0000'
 * normalizeHexColor('FF0000') => 'ff0000'
 * normalizeHexColor('abc') => 'aabbcc'
 */
export function normalizeHexColor(input: string): string {
  const color = input.toLowerCase()
  
  // Expand 3-char hex to 6-char
  if (color.length === 3) {
    return color
      .split('')
      .map((c) => c + c)
      .join('')
  }
  
  return color
}
