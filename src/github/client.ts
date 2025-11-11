/**
 * GitHub API Client
 * Wrapper around Octokit for label operations
 */

import { Octokit } from 'octokit'
import type { LabelConfig } from '../types'

export interface GitHubClientOptions {
  /** GitHub personal access token */
  token: string

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
  private octokit: Octokit
  private owner: string
  private repo: string

  constructor(options: GitHubClientOptions) {
    this.octokit = new Octokit({ auth: options.token })
    this.owner = options.owner
    this.repo = options.repo
  }

  /**
   * Fetch all labels from repository
   */
  async fetchLabels(): Promise<GitHubLabel[]> {
    try {
      const { data } = await this.octokit.rest.issues.listLabelsForRepo({
        owner: this.owner,
        repo: this.repo,
        per_page: 100
      })

      return data.map((label) => ({
        name: label.name,
        color: label.color,
        description: label.description || ''
      }))
    } catch (error) {
      throw new Error(`Failed to fetch labels from ${this.owner}/${this.repo}: ${error}`)
    }
  }

  /**
   * Create a new label
   */
  async createLabel(label: LabelConfig): Promise<GitHubLabel> {
    try {
      const { data } = await this.octokit.rest.issues.createLabel({
        owner: this.owner,
        repo: this.repo,
        name: label.name,
        color: label.color,
        description: label.description
      })

      return {
        name: data.name,
        color: data.color,
        description: data.description || ''
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
      const { data } = await this.octokit.rest.issues.updateLabel({
        owner: this.owner,
        repo: this.repo,
        current_name: currentName,
        name: label.name,
        color: label.color,
        description: label.description
      })

      return {
        name: data.name,
        color: data.color,
        description: data.description || ''
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
      await this.octokit.rest.issues.deleteLabel({
        owner: this.owner,
        repo: this.repo,
        name
      })
    } catch (error) {
      throw new Error(`Failed to delete label "${name}": ${error}`)
    }
  }

  /**
   * Check if label exists
   */
  async hasLabel(name: string): Promise<boolean> {
    try {
      await this.octokit.rest.issues.getLabel({
        owner: this.owner,
        repo: this.repo,
        name
      })
      return true
    } catch (error) {
      return false
    }
  }
}
