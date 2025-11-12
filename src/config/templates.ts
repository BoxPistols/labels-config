/**
 * Configuration Templates
 * Pre-built label configurations for common use cases
 */

import type { LabelConfig } from '../types'

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
 * SDPF (Smart Drone Platform Frontend) template - English
 * Refined and practical label set for production projects
 */
export const SDPF_EN_TEMPLATE: LabelConfig[] = createLabels([
  {
    name: 'API',
    color: 'ffb300',
    description: 'API integration and external services'
  },
  {
    name: 'BFF',
    color: '7057ff',
    description: 'Backend for Frontend integration'
  },
  {
    name: 'CI/CD',
    color: '00ced1',
    description: 'CI/CD and automation'
  },
  {
    name: 'Component',
    color: '008672',
    description: 'Component addition and updates'
  },
  {
    name: 'Documentation',
    color: '332412',
    description: 'Documentation additions and updates'
  },
  {
    name: 'Hotfix',
    color: 'ff6347',
    description: 'Emergency fixes and hotfixes'
  },
  {
    name: 'Refactoring',
    color: 'a9a9a9',
    description: 'Code refactoring and performance optimization'
  },
  {
    name: 'Testing',
    color: '08a4d6',
    description: 'Testing, E2E, and unit tests'
  },
  {
    name: 'Type Definition',
    color: 'e91e63',
    description: 'TypeScript type definitions and type safety'
  },
  {
    name: 'Design',
    color: 'd876e3',
    description: 'UI/UX design'
  },
  {
    name: 'Specification',
    color: 'd93f0b',
    description: 'Specification changes'
  },
  {
    name: 'Feature',
    color: 'b3fa11',
    description: 'New feature addition'
  },
  {
    name: 'Environment',
    color: 'c5def5',
    description: 'Development environment and package updates'
  },
  {
    name: 'Page',
    color: '16c9f5',
    description: 'Page additions and updates'
  }
])

/**
 * SDPF (Smart Drone Platform Frontend) template - Japanese
 * Refined and practical label set for production projects
 * All labels in Japanese for domestic projects
 */
export const SDPF_JA_TEMPLATE: LabelConfig[] = createLabels([
  {
    name: 'API連携',
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
    name: 'コンポーネント',
    color: '008672',
    description: 'コンポーネントの追加・更新'
  },
  {
    name: 'ドキュメント',
    color: '332412',
    description: 'ドキュメントの追加・更新'
  },
  {
    name: '緊急対応',
    color: 'ff6347',
    description: '緊急修正・Hotfix'
  },
  {
    name: 'リファクタ',
    color: 'a9a9a9',
    description: 'リファクタリング・パフォーマンス最適化・コード整理'
  },
  {
    name: 'テスト',
    color: '08a4d6',
    description: 'テスト・E2E・ユニットテスト'
  },
  {
    name: '型定義',
    color: 'e91e63',
    description: 'TypeScript型定義・型安全性'
  },
  {
    name: 'デザイン',
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
    description: '開発環境・パッケージの追加・変更・更新'
  },
  {
    name: '画面追加',
    color: '16c9f5',
    description: '画面の追加・更新'
  }
])

/**
 * SDPF default template (alias for Japanese version for backward compatibility)
 */
export const SDPF_TEMPLATE = SDPF_JA_TEMPLATE

/**
 * React Development template
 * Focused on React ecosystem and component development
 */
export const REACT_TEMPLATE: LabelConfig[] = createLabels([
  {
    name: 'component',
    color: '61dafb',
    description: 'React component development'
  },
  {
    name: 'hook',
    color: '20232a',
    description: 'Custom hooks implementation'
  },
  {
    name: 'state-management',
    color: '764abc',
    description: 'Redux, Zustand, Context API'
  },
  {
    name: 'performance',
    color: 'ffc107',
    description: 'Performance optimization, memoization'
  },
  {
    name: 'typescript',
    color: '3178c6',
    description: 'TypeScript types and interfaces'
  },
  {
    name: 'styling',
    color: 'ff69b4',
    description: 'CSS-in-JS, Tailwind, styled-components'
  },
  {
    name: 'testing',
    color: '15c213',
    description: 'Unit tests, React Testing Library'
  },
  {
    name: 'bug',
    color: 'd73a4a',
    description: 'Bug fix required'
  },
  {
    name: 'refactor',
    color: 'fbca04',
    description: 'Code refactoring'
  },
  {
    name: 'accessibility',
    color: '0e8a16',
    description: 'A11y improvements'
  }
])

/**
 * Vue.js Development template
 * Focused on Vue ecosystem and composition API
 */
export const VUE_TEMPLATE: LabelConfig[] = createLabels([
  {
    name: 'component',
    color: '42b883',
    description: 'Vue component development'
  },
  {
    name: 'composable',
    color: '35495e',
    description: 'Composition API, composables'
  },
  {
    name: 'pinia',
    color: 'ffd859',
    description: 'Pinia state management'
  },
  {
    name: 'vue-router',
    color: '3ba57a',
    description: 'Vue Router navigation'
  },
  {
    name: 'typescript',
    color: '3178c6',
    description: 'TypeScript integration'
  },
  {
    name: 'styling',
    color: 'ff69b4',
    description: 'Scoped CSS, CSS modules'
  },
  {
    name: 'testing',
    color: '15c213',
    description: 'Vitest, Vue Test Utils'
  },
  {
    name: 'bug',
    color: 'd73a4a',
    description: 'Bug fix required'
  },
  {
    name: 'performance',
    color: 'ffc107',
    description: 'Performance optimization'
  },
  {
    name: 'accessibility',
    color: '0e8a16',
    description: 'A11y improvements'
  }
])

/**
 * General Frontend Development template
 * Framework-agnostic frontend development labels
 */
export const FRONTEND_TEMPLATE: LabelConfig[] = createLabels([
  {
    name: 'feature',
    color: '0e8a16',
    description: 'New feature implementation'
  },
  {
    name: 'bug',
    color: 'd73a4a',
    description: 'Bug fix required'
  },
  {
    name: 'ui',
    color: 'ff69b4',
    description: 'UI/UX improvements'
  },
  {
    name: 'styling',
    color: 'c5def5',
    description: 'CSS, styling updates'
  },
  {
    name: 'responsive',
    color: '1d76db',
    description: 'Responsive design, mobile support'
  },
  {
    name: 'performance',
    color: 'ffc107',
    description: 'Performance optimization'
  },
  {
    name: 'accessibility',
    color: '0052cc',
    description: 'A11y improvements'
  },
  {
    name: 'testing',
    color: '15c213',
    description: 'Testing, E2E, unit tests'
  },
  {
    name: 'dependencies',
    color: '0366d6',
    description: 'Dependencies update'
  },
  {
    name: 'documentation',
    color: '0075ca',
    description: 'Documentation updates'
  },
  {
    name: 'build',
    color: 'fbca04',
    description: 'Build system, bundler'
  },
  {
    name: 'seo',
    color: 'b60205',
    description: 'SEO optimization'
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
  react: REACT_TEMPLATE,
  vue: VUE_TEMPLATE,
  frontend: FRONTEND_TEMPLATE,
  'sdpf-en': SDPF_EN_TEMPLATE,
  'sdpf-ja': SDPF_JA_TEMPLATE,
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
