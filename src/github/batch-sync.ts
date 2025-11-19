/**
 * Batch sync functionality for multiple repositories
 */
import { GitHubLabelSync } from './sync';
import { LabelConfig } from '../types';
import { colorize } from '../utils/ui';

export interface BatchSyncOptions {
  repositories?: string[];      // 特定のリポジトリリスト
  organization?: string;         // 組織全体
  user?: string;                // ユーザーの全リポジトリ
  template?: string;            // 使用するテンプレート
  mode?: 'append' | 'replace'; // 同期モード
  dryRun?: boolean;            // ドライラン
  parallel?: number;           // 並列実行数（デフォルト: 3）
  filter?: {
    visibility?: 'public' | 'private' | 'all';
    language?: string;
    archived?: boolean;
  };
}

export interface BatchSyncResult {
  repository: string;
  status: 'success' | 'failed' | 'skipped';
  result?: any;
  error?: string;
}

export class BatchLabelSync {
  private static readonly DEFAULT_PARALLEL = 3;

  /**
   * 複数リポジトリへのラベル一括同期
   */
  async syncMultiple(
    labels: LabelConfig[],
    options: BatchSyncOptions
  ): Promise<BatchSyncResult[]> {
    const repos = await this.getTargetRepositories(options);
    const results: BatchSyncResult[] = [];

    console.log(colorize(`\n📋 Target repositories: ${repos.length}`, 'cyan'));

    // プログレス表示
    let completed = 0;
    const parallel = options.parallel || BatchLabelSync.DEFAULT_PARALLEL;

    // バッチ処理
    for (let i = 0; i < repos.length; i += parallel) {
      const batch = repos.slice(i, i + parallel);
      const batchResults = await Promise.allSettled(
        batch.map(repo => this.syncSingleRepo(repo, labels, options))
      );

      batchResults.forEach((result, index) => {
        const repo = batch[index];
        if (result.status === 'fulfilled') {
          results.push(result.value);
          completed++;
          console.log(colorize(`✅ [${completed}/${repos.length}] ${repo}`, 'green'));
        } else {
          results.push({
            repository: repo,
            status: 'failed',
            error: result.reason?.message || 'Unknown error'
          });
          completed++;
          console.log(colorize(`❌ [${completed}/${repos.length}] ${repo}: ${result.reason}`, 'red'));
        }
      });
    }

    return results;
  }

  /**
   * 単一リポジトリへの同期
   */
  private async syncSingleRepo(
    repository: string,
    labels: LabelConfig[],
    options: BatchSyncOptions
  ): Promise<BatchSyncResult> {
    try {
      // リポジトリ名を owner/repo に分割
      const [owner, repo] = repository.split('/');
      if (!owner || !repo) {
        throw new Error(`Invalid repository format: ${repository}. Expected format: owner/repo`);
      }

      const sync = new GitHubLabelSync({
        owner,
        repo,
        deleteExtra: options.mode === 'replace',
        dryRun: options.dryRun || false
      });

      const result = await sync.syncLabels(labels);

      return {
        repository,
        status: 'success',
        result
      };
    } catch (error) {
      return {
        repository,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * 対象リポジトリリストの取得
   */
  private async getTargetRepositories(options: BatchSyncOptions): Promise<string[]> {
    // 特定のリポジトリリストが指定されている場合
    if (options.repositories && options.repositories.length > 0) {
      return options.repositories;
    }

    // 組織の全リポジトリを取得
    if (options.organization) {
      return this.getOrganizationRepos(options.organization, options.filter);
    }

    // ユーザーの全リポジトリを取得
    if (options.user) {
      return this.getUserRepos(options.user, options.filter);
    }

    throw new Error('No target repositories specified');
  }

  /**
   * 組織のリポジトリ一覧を取得
   */
  private async getOrganizationRepos(
    org: string,
    filter?: BatchSyncOptions['filter']
  ): Promise<string[]> {
    const { execSync } = await import('child_process');

    try {
      const command = `gh repo list ${org} --json nameWithOwner,visibility,language,isArchived --limit 1000`;
      const output = execSync(command, { encoding: 'utf-8' });
      const repos = JSON.parse(output);

      return repos
        .filter((repo: any) => {
          // フィルタリング
          if (filter?.visibility && filter.visibility !== 'all' && repo.visibility !== filter.visibility) {
            return false;
          }
          if (filter?.language && repo.language !== filter.language) {
            return false;
          }
          if (filter?.archived !== undefined && repo.isArchived !== filter.archived) {
            return false;
          }
          return true;
        })
        .map((repo: any) => repo.nameWithOwner);
    } catch (error) {
      throw new Error(`Failed to fetch organization repos: ${error}`);
    }
  }

  /**
   * ユーザーのリポジトリ一覧を取得
   */
  private async getUserRepos(
    user: string,
    filter?: BatchSyncOptions['filter']
  ): Promise<string[]> {
    const { execSync } = await import('child_process');

    try {
      const command = `gh repo list ${user} --json nameWithOwner,visibility,language,isArchived --limit 1000`;
      const output = execSync(command, { encoding: 'utf-8' });
      const repos = JSON.parse(output);

      return repos
        .filter((repo: any) => {
          // フィルタリング
          if (filter?.visibility && filter.visibility !== 'all' && repo.visibility !== filter.visibility) {
            return false;
          }
          if (filter?.language && repo.language !== filter.language) {
            return false;
          }
          if (filter?.archived !== undefined && repo.isArchived !== filter.archived) {
            return false;
          }
          return true;
        })
        .map((repo: any) => repo.nameWithOwner);
    } catch (error) {
      throw new Error(`Failed to fetch user repos: ${error}`);
    }
  }

  /**
   * 結果サマリーの生成
   */
  generateSummary(results: BatchSyncResult[]): string {
    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    let summary = '\n📊 Batch Sync Summary:\n';
    summary += `✅ Successful: ${successful}\n`;
    if (failed > 0) summary += `❌ Failed: ${failed}\n`;
    if (skipped > 0) summary += `⏭️  Skipped: ${skipped}\n`;

    // 失敗したリポジトリの詳細
    const failedRepos = results.filter(r => r.status === 'failed');
    if (failedRepos.length > 0) {
      summary += '\n❌ Failed repositories:\n';
      failedRepos.forEach(repo => {
        summary += `  - ${repo.repository}: ${repo.error}\n`;
      });
    }

    return summary;
  }
}