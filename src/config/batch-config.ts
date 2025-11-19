/**
 * Batch configuration file parser
 * Supports JSON and YAML batch configurations
 */
import { LabelConfig } from '../types';
import { BatchSyncOptions } from '../github/batch-sync';

export interface BatchConfigTarget {
  // リポジトリ指定方法（いずれか必須）
  organization?: string;
  user?: string;
  repositories?: string[];

  // ラベル設定（いずれか必須）
  template?: string;
  file?: string;

  // 同期オプション
  mode?: 'append' | 'replace';
  parallel?: number;

  // フィルター
  filter?: {
    visibility?: 'public' | 'private' | 'all';
    language?: string;
    archived?: boolean;
  };
}

export interface BatchConfig {
  version: string;
  description?: string;

  // デフォルト設定
  defaults?: {
    template?: string;
    mode?: 'append' | 'replace';
    parallel?: number;
  };

  // ターゲット設定のリスト
  targets: BatchConfigTarget[];
}

export class BatchConfigLoader {
  /**
   * バッチ設定ファイルの読み込み
   */
  static async load(filePath: string): Promise<BatchConfig> {
    const { promises: fs } = await import('fs');

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const config = JSON.parse(content) as BatchConfig;

      // バリデーション
      this.validate(config);

      return config;
    } catch (error) {
      throw new Error(`Failed to load batch config: ${error}`);
    }
  }

  /**
   * バッチ設定のバリデーション
   */
  static validate(config: BatchConfig): void {
    if (!config.version) {
      throw new Error('Batch config version is required');
    }

    if (!config.targets || config.targets.length === 0) {
      throw new Error('At least one target is required');
    }

    config.targets.forEach((target, index) => {
      // リポジトリ指定の検証
      const hasRepoSpec = target.organization || target.user || target.repositories;
      if (!hasRepoSpec) {
        throw new Error(`Target ${index}: One of organization, user, or repositories is required`);
      }

      // ラベル設定の検証
      const hasLabelSpec = target.template || target.file;
      if (!hasLabelSpec) {
        throw new Error(`Target ${index}: Either template or file is required`);
      }
    });
  }

  /**
   * BatchConfigTargetをBatchSyncOptionsに変換
   */
  static targetToOptions(
    target: BatchConfigTarget,
    defaults?: BatchConfig['defaults']
  ): Omit<BatchSyncOptions, 'template'> & { template?: string; file?: string } {
    return {
      organization: target.organization,
      user: target.user,
      repositories: target.repositories,
      template: target.template || defaults?.template,
      mode: target.mode || defaults?.mode || 'append',
      parallel: target.parallel || defaults?.parallel || 3,
      filter: target.filter,
      dryRun: false
    };
  }
}
