/**
 * Configuration Templates
 * Pre-built label configurations for common use cases
 */

import type { LabelConfig, LabelRegistry } from '../types'

/**
 * Minimal template for getting started
 */
export const MINIMAL_TEMPLATE: LabelConfig[] = [
  {
    name: 'bug',
    color: 'ff0000' as any,
    description: 'Something is broken'
  },
  {
    name: 'feature',
    color: '00ff00' as any,
    description: 'New feature or request'
  },
  {
    name: 'documentation',
    color: '0000ff' as any,
    description: 'Improvements or additions to documentation'
  }
]

/**
 * Standard GitHub template
 */
const createLabels = (labels: any[]): LabelConfig[] => labels

export const GITHUB_STANDARD_TEMPLATE: LabelConfig[] = createLabels([
  {
    name: 'bug',
    color: 'd73a4a',
    description: 'Something is broken'
  },
  {
    name: 'documentation',
    color: '0075ca',
    description: 'Improvements or additions to documentation'
  },
  {
    name: 'duplicate',
    color: 'cfd3d7',
    description: 'This issue or pull request already exists'
  },
  {
    name: 'enhancement',
    color: 'a2eeef',
    description: 'New feature or request'
  },
  {
    name: 'good first issue',
    color: '7057ff',
    description: 'Good for newcomers'
  },
  {
    name: 'help wanted',
    color: '008672',
    description: 'Extra attention is needed'
  },
  {
    name: 'invalid',
    color: 'e4e669',
    description: 'This does not seem right'
  },
  {
    name: 'question',
    color: 'd876e3',
    description: 'Further information is requested'
  },
  {
    name: 'wontfix',
    color: 'ffffff',
    description: 'This will not be worked on'
  }
])

/**
 * SDPF (Smart Drone Platform Frontend) template
 * Based on shells/labels.json from the original repository
 */
export const SDPF_TEMPLATE: LabelConfig[] = createLabels([
  {
    name: 'API',
    color: 'ffb300',
    description: 'API・外部サービス連携'
  },
  {
    name: 'BFF',
    color: '7057ff',
    description: 'BFF・バックエンド連携'
  },
  {
    name: 'CI/CD',
    color: '00ced1',
    description: 'CI/CD・自動化'
  },
  {
    name: 'Component',
    color: '008672',
    description: 'Componentの追加 更新'
  },
  {
    name: 'Docs',
    color: '332412',
    description: 'ドキュメントの追加 更新'
  },
  {
    name: 'Hotfix',
    color: 'ff6347',
    description: '緊急修正・Hotfix'
  },
  {
    name: 'Map',
    color: '1e90ff',
    description: '地図・マップ・経路・ウェイポイント関連'
  },
  {
    name: 'Next.js',
    color: '00c851',
    description: 'Next.js特有の機能・SSR・SSG・App Router'
  },
  {
    name: 'Performance',
    color: 'ffc107',
    description: 'パフォーマンス最適化'
  },
  {
    name: 'Refactoring',
    color: 'a9a9a9',
    description: 'リファクタリング・コード整理'
  },
  {
    name: 'Test',
    color: '08a4d6',
    description: 'テスト・E2E・ユニットテスト'
  },
  {
    name: 'Theme',
    color: 'ff69b4',
    description: 'デザインテーマ設計'
  },
  {
    name: 'Turbo',
    color: '795548',
    description: 'Turbo・モノレポ管理'
  },
  {
    name: 'TypeScript',
    color: 'e91e63',
    description: 'TypeScript型定義・型安全性'
  },
  {
    name: 'UI Code',
    color: '3f51b5',
    description: 'UI Cording・MUI・Tailwind'
  },
  {
    name: 'UIUX',
    color: 'd876e3',
    description: 'UIUXデザイン'
  },
  {
    name: '仕様変更',
    color: 'd93f0b',
    description: '仕様変更'
  },
  {
    name: '機能追加',
    color: 'b3fa11',
    description: '機能追加'
  },
  {
    name: '環境構築',
    color: 'c5def5',
    description: '開発環境 パッケージの追加 変更 更新'
  },
  {
    name: '画面追加',
    color: '16c9f5',
    description: '画面の追加 更新'
  }
])

/**
 * Agile/Scrum template
 */
export const AGILE_TEMPLATE: LabelConfig[] = createLabels([
  {
    name: 'story',
    color: '0e7490',
    description: 'User story'
  },
  {
    name: 'task',
    color: '4c72a0',
    description: 'Implementation task'
  },
  {
    name: 'spike',
    color: 'ab47bc',
    description: 'Research and exploration'
  },
  {
    name: 'bug',
    color: 'd32f2f',
    description: 'Bug fix'
  },
  {
    name: 'debt',
    color: 'f57c00',
    description: 'Technical debt'
  },
  {
    name: 'blocked',
    color: '616161',
    description: 'Blocked by another issue'
  },
  {
    name: 'priority:critical',
    color: 'ff0000',
    description: 'Critical priority'
  },
  {
    name: 'priority:high',
    color: 'ff9800',
    description: 'High priority'
  },
  {
    name: 'priority:medium',
    color: 'ffc107',
    description: 'Medium priority'
  },
  {
    name: 'priority:low',
    color: 'cddc39',
    description: 'Low priority'
  }
])

/**
 * All available templates
 */
export const CONFIG_TEMPLATES = {
  minimal: MINIMAL_TEMPLATE,
  github: GITHUB_STANDARD_TEMPLATE,
  sdpf: SDPF_TEMPLATE,
  agile: AGILE_TEMPLATE
}

export type TemplateName = keyof typeof CONFIG_TEMPLATES

/**
 * Get template by name
 */
export function getTemplate(name: TemplateName): LabelConfig[] {
  return CONFIG_TEMPLATES[name] ?? CONFIG_TEMPLATES.github
}

/**
 * List all available templates
 */
export function listTemplates(): TemplateName[] {
  return Object.keys(CONFIG_TEMPLATES) as TemplateName[]
}
