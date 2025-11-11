/**
 * GitHub Label Synchronization
 * Syncs local labels to GitHub repositories
 */

import { GitHubClient, type GitHubClientOptions, type GitHubLabel } from './client'
import type { LabelConfig } from '../types'

export type { GitHubClientOptions, GitHubLabel }

export interface GitHubSyncOptions extends GitHubClientOptions {
  /** Dry run mode - don't make actual changes */
  dryRun?: boolean

  /** Delete labels on GitHub that don't exist locally */
  deleteExtra?: boolean

  /** Verbose logging */
  verbose?: boolean
}

export interface SyncResult {
  /** Labels created */
  created: LabelConfig[]

  /** Labels updated */
  updated: LabelConfig[]

  /** Labels deleted */
  deleted: string[]

  /** Labels unchanged */
  unchanged: LabelConfig[]

  /** Errors during sync */
  errors: Array<{ name: string; error: string }>
}

export class GitHubLabelSync {
  private client: GitHubClient
  private options: GitHubSyncOptions

  constructor(options: GitHubSyncOptions) {
    this.client = new GitHubClient(options)
    this.options = options
  }

  /**
   * Log message if verbose mode is enabled
   */
  private log(message: string): void {
    if (this.options.verbose) {
      console.log(`[labels-config] ${message}`)
    }
  }

  /**
   * Sync labels to GitHub repository
   */
  async syncLabels(localLabels: LabelConfig[]): Promise<SyncResult> {
    this.log('Fetching remote labels...')
    const remoteLabels = await this.client.fetchLabels()

    const result: SyncResult = {
      created: [],
      updated: [],
      deleted: [],
      unchanged: [],
      errors: []
    }

    const remoteLabelMap = new Map(remoteLabels.map((label) => [label.name.toLowerCase(), label]))
    const localLabelMap = new Map(localLabels.map((label) => [label.name.toLowerCase(), label]))

    // Process local labels
    for (const label of localLabels) {
      const remoteLabel = remoteLabelMap.get(label.name.toLowerCase())

      try {
        if (!remoteLabel) {
          // Create new label
          if (!this.options.dryRun) {
            await this.client.createLabel(label)
          }
          result.created.push(label)
          this.log(`Created label: ${label.name}`)
        } else if (this.hasChanges(label, remoteLabel)) {
          // Update existing label
          if (!this.options.dryRun) {
            await this.client.updateLabel(remoteLabel.name, label)
          }
          result.updated.push(label)
          this.log(`Updated label: ${label.name}`)
        } else {
          // No changes needed
          result.unchanged.push(label)
          this.log(`Unchanged label: ${label.name}`)
        }
      } catch (error) {
        result.errors.push({
          name: label.name,
          error: error instanceof Error ? error.message : String(error)
        })
        this.log(`Error processing label "${label.name}": ${error}`)
      }
    }

    // Handle extra remote labels
    if (this.options.deleteExtra) {
      for (const remoteLabel of remoteLabels) {
        if (!localLabelMap.has(remoteLabel.name.toLowerCase())) {
          try {
            if (!this.options.dryRun) {
              await this.client.deleteLabel(remoteLabel.name)
            }
            result.deleted.push(remoteLabel.name)
            this.log(`Deleted label: ${remoteLabel.name}`)
          } catch (error) {
            result.errors.push({
              name: remoteLabel.name,
              error: error instanceof Error ? error.message : String(error)
            })
          }
        }
      }
    }

    return result
  }

  /**
   * Check if label has changes
   */
  private hasChanges(local: LabelConfig, remote: GitHubLabel): boolean {
    return (
      local.color.toLowerCase() !== remote.color.toLowerCase() ||
      local.description !== (remote.description || '')
    )
  }

  /**
   * Fetch labels from GitHub
   */
  async fetchLabels(): Promise<LabelConfig[]> {
    const labels = await this.client.fetchLabels()
    return labels.map((label) => ({
      name: label.name,
      color: label.color as any,
      description: label.description || ''
    }))
  }

  /**
   * Delete a single label
   */
  async deleteLabel(name: string): Promise<void> {
    if (!this.options.dryRun) {
      await this.client.deleteLabel(name)
    }
    this.log(`Deleted label: ${name}`)
  }

  /**
   * Update a single label
   */
  async updateLabel(name: string, updates: Partial<LabelConfig>): Promise<void> {
    if (!this.options.dryRun) {
      await this.client.updateLabel(name, updates)
    }
    this.log(`Updated label: ${name}`)
  }
}
