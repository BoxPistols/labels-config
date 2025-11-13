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
   * Sync labels to GitHub repository with batch operations for better performance
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

    // Categorize operations
    const toCreate: LabelConfig[] = []
    const toUpdate: Array<{ current: string; updated: LabelConfig }> = []
    const toDelete: string[] = []

    // Determine which labels need to be created or updated
    for (const label of localLabels) {
      const remoteLabel = remoteLabelMap.get(label.name.toLowerCase())

      if (!remoteLabel) {
        toCreate.push(label)
      } else if (this.hasChanges(label, remoteLabel)) {
        toUpdate.push({ current: remoteLabel.name, updated: label })
      } else {
        result.unchanged.push(label)
        this.log(`Unchanged label: ${label.name}`)
      }
    }

    // Determine which labels need to be deleted
    if (this.options.deleteExtra) {
      for (const remoteLabel of remoteLabels) {
        if (!localLabelMap.has(remoteLabel.name.toLowerCase())) {
          toDelete.push(remoteLabel.name)
        }
      }
    }

    // Execute operations in batches for better performance
    if (!this.options.dryRun) {
      // Process creates in parallel (batch of 5)
      const BATCH_SIZE = 5
      for (let i = 0; i < toCreate.length; i += BATCH_SIZE) {
        const batch = toCreate.slice(i, i + BATCH_SIZE)
        const promises = batch.map(async (label) => {
          try {
            await this.client.createLabel(label)
            result.created.push(label)
            this.log(`Created label: ${label.name}`)
          } catch (error) {
            result.errors.push({
              name: label.name,
              error: error instanceof Error ? error.message : String(error)
            })
            this.log(`Error creating label "${label.name}": ${error}`)
          }
        })
        await Promise.all(promises)
      }

      // Process updates in parallel (batch of 5)
      for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
        const batch = toUpdate.slice(i, i + BATCH_SIZE)
        const promises = batch.map(async ({ current, updated }) => {
          try {
            await this.client.updateLabel(current, updated)
            result.updated.push(updated)
            this.log(`Updated label: ${updated.name}`)
          } catch (error) {
            result.errors.push({
              name: updated.name,
              error: error instanceof Error ? error.message : String(error)
            })
            this.log(`Error updating label "${updated.name}": ${error}`)
          }
        })
        await Promise.all(promises)
      }

      // Process deletes in parallel (batch of 5)
      for (let i = 0; i < toDelete.length; i += BATCH_SIZE) {
        const batch = toDelete.slice(i, i + BATCH_SIZE)
        const promises = batch.map(async (name) => {
          try {
            await this.client.deleteLabel(name)
            result.deleted.push(name)
            this.log(`Deleted label: ${name}`)
          } catch (error) {
            result.errors.push({
              name,
              error: error instanceof Error ? error.message : String(error)
            })
            this.log(`Error deleting label "${name}": ${error}`)
          }
        })
        await Promise.all(promises)
      }
    } else {
      // Dry run mode - just populate results
      result.created.push(...toCreate)
      result.updated.push(...toUpdate.map(op => op.updated))
      result.deleted.push(...toDelete)

      toCreate.forEach(label => this.log(`[DRY RUN] Would create label: ${label.name}`))
      toUpdate.forEach(({updated}) => this.log(`[DRY RUN] Would update label: ${updated.name}`))
      toDelete.forEach(name => this.log(`[DRY RUN] Would delete label: ${name}`))
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
