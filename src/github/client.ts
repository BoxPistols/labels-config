/**
 * GitHub CLI Client
 * Wrapper around gh CLI for label operations
 * No token required - uses gh CLI authentication
 */

import { execSync } from 'child_process'
import type { LabelConfig } from '../types'

export interface GitHubClientOptions {
  /** Repository owner */
  owner: string

  /** Repository name */
  repo: string
}

export interface GitHubLabel {
  /** Label name */
  name: string

  /** Hex color (without #) */
  color: string

  /** Label description */
  description?: string
}

export class GitHubClient {
  private owner: string
  private repo: string
  private repoPath: string

  constructor(options: GitHubClientOptions) {
    this.owner = options.owner
    this.repo = options.repo
    this.repoPath = `${this.owner}/${this.repo}`
  }

  /**
   * Execute gh CLI command
   */
  private exec(command: string): string {
    try {
      return execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim()
    } catch (error: any) {
      throw new Error(`gh CLI command failed: ${error.message}`)
    }
  }

  /**
   * Fetch all labels from repository
   */
  async fetchLabels(): Promise<GitHubLabel[]> {
    try {
      const output = this.exec(
        `gh label list --repo ${this.repoPath} --json name,color,description --limit 1000`
      )

      if (!output) {
        return []
      }

      const labels = JSON.parse(output)
      return labels.map((label: any) => ({
        name: label.name,
        color: label.color,
        description: label.description || ''
      }))
    } catch (error) {
      throw new Error(`Failed to fetch labels from ${this.repoPath}: ${error}`)
    }
  }

  /**
   * Create a new label
   */
  async createLabel(label: LabelConfig): Promise<GitHubLabel> {
    try {
      // Escape quotes in name and description
      const name = label.name.replace(/"/g, '\\"')
      const description = label.description.replace(/"/g, '\\"')
      const color = label.color.replace('#', '')

      this.exec(
        `gh label create "${name}" --color "${color}" --description "${description}" --repo ${this.repoPath}`
      )

      return {
        name: label.name,
        color: label.color,
        description: label.description
      }
    } catch (error) {
      throw new Error(`Failed to create label "${label.name}": ${error}`)
    }
  }

  /**
   * Update an existing label
   */
  async updateLabel(currentName: string, label: Partial<LabelConfig>): Promise<GitHubLabel> {
    try {
      const escapedCurrentName = currentName.replace(/"/g, '\\"')
      const args: string[] = []

      if (label.name && label.name !== currentName) {
        args.push(`--name "${label.name.replace(/"/g, '\\"')}"`)
      }
      if (label.color) {
        args.push(`--color "${label.color.replace('#', '')}"`)
      }
      if (label.description !== undefined) {
        args.push(`--description "${label.description.replace(/"/g, '\\"')}"`)
      }

      if (args.length === 0) {
        // No changes needed
        return {
          name: currentName,
          color: label.color || '',
          description: label.description || ''
        }
      }

      this.exec(
        `gh label edit "${escapedCurrentName}" ${args.join(' ')} --repo ${this.repoPath}`
      )

      return {
        name: label.name || currentName,
        color: label.color || '',
        description: label.description || ''
      }
    } catch (error) {
      throw new Error(`Failed to update label "${currentName}": ${error}`)
    }
  }

  /**
   * Delete a label
   */
  async deleteLabel(name: string): Promise<void> {
    try {
      const escapedName = name.replace(/"/g, '\\"')
      this.exec(`gh label delete "${escapedName}" --repo ${this.repoPath} --yes`)
    } catch (error) {
      throw new Error(`Failed to delete label "${name}": ${error}`)
    }
  }

  /**
   * Check if label exists
   */
  async hasLabel(name: string): Promise<boolean> {
    try {
      const labels = await this.fetchLabels()
      return labels.some((label) => label.name.toLowerCase() === name.toLowerCase())
    } catch (error) {
      return false
    }
  }
}
