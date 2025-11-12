/**
 * Label Validation Schema
 * Uses Zod for runtime validation with TypeScript type safety
 */

import { z } from 'zod'
import type { LabelConfig, LabelRegistry, HexColor } from './types'
import { normalizeHexColor } from './utils/color'

/**
 * Validates hex color format
 * Accepts 3 or 6 character hex codes (without # prefix)
 */
const hexColorSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{6}$|^[0-9a-fA-F]{3}$/, 'Invalid hex color format')
  .transform((color) => normalizeHexColor(color)) as unknown as z.ZodType<HexColor>

/**
 * Label configuration schema
 */
export const labelConfigSchema = z.object({
  name: z
    .string()
    .min(1, 'Label name is required')
    .max(50, 'Label name must be 50 characters or less')
    .regex(
      /^[a-zA-Z0-9\-\s\/\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]+$/,
      'Label name contains invalid characters'
    ),
  color: hexColorSchema,
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description must be 200 characters or less')
})

/**
 * Label category schema
 */
export const labelCategorySchema = z.object({
  category: z
    .string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be 50 characters or less'),
  labels: z.array(labelConfigSchema)
})

/**
 * Label registry schema
 */
export const labelRegistrySchema = z.object({
  version: z.string(),
  timestamp: z.string().datetime().optional(),
  labels: z.union([
    z.array(labelConfigSchema),
    z.array(labelCategorySchema)
  ]),
  metadata: z.record(z.unknown()).optional()
})

/**
 * Validates a single label configuration
 */
export function validateLabel(label: unknown): LabelConfig {
  return labelConfigSchema.parse(label)
}

/**
 * Validates multiple labels
 */
export function validateLabels(labels: unknown): LabelConfig[] {
  const schema = z.array(labelConfigSchema)
  return schema.parse(labels)
}

/**
 * Validates a complete label registry
 */
export function validateRegistry(registry: unknown): LabelRegistry {
  return labelRegistrySchema.parse(registry)
}

/**
 * Helper function to find duplicate strings in O(n) time
 * @param values - Array of strings to check for duplicates
 * @returns Array of unique duplicate values
 */
function findDuplicateStrings(values: string[]): string[] {
  const seen = new Map<string, number>()
  const duplicates = new Set<string>()
  
  for (const value of values) {
    const count = seen.get(value) || 0
    seen.set(value, count + 1)
    
    if (count === 1) {
      duplicates.add(value)
    }
  }
  
  return Array.from(duplicates)
}

/**
 * Checks for duplicate label names
 */
export function checkDuplicateNames(labels: LabelConfig[]): string[] {
  const names = labels.map((label) => label.name)
  return findDuplicateStrings(names)
}

/**
 * Checks for duplicate colors (case-insensitive)
 * Normalizes colors before comparison to handle unparsed labels
 */
export function checkDuplicateColors(labels: LabelConfig[]): string[] {
  const colors = labels.map((label) => normalizeHexColor(label.color))
  return findDuplicateStrings(colors)
}

/**
 * Comprehensive validation with detailed error reporting
 */
export function validateWithDetails(labels: unknown) {
  try {
    const parsed = validateLabels(labels)

    const duplicateNames = checkDuplicateNames(parsed)
    const duplicateColors = checkDuplicateColors(parsed)

    return {
      valid: duplicateNames.length === 0 && duplicateColors.length === 0,
      labels: parsed,
      errors: {
        duplicateNames,
        duplicateColors
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        labels: [],
        errors: {
          validationErrors: error.errors
        }
      }
    }
    throw error
  }
}
