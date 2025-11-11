# Examples

このディレクトリには、`labels-config-boxpistols` の実際の使用例があります。

## SDPF Template Example

### JSON ファイル

[`sdpf-labels-sample.json`](./sdpf-labels-sample.json) - SDPF（Smart Drone Platform Frontend）の完全な20個のラベル定義

このファイルには、元の `sdpf-frontend-next` プロジェクトのすべてのラベルが含まれています：

```json
{
  "version": "1.0.0",
  "labels": [
    {
      "name": "API",
      "color": "ffb300",
      "description": "API・外部サービス連携"
    },
    // ... 19 more labels
  ]
}
```

### TypeScript Example

[`sdpf-example.ts`](./sdpf-example.ts) - SDPF テンプレートを使用した完全な例

実行方法：

```bash
# インストール
npm install labels-config-boxpistols

# 例を実行
npx ts-node examples/sdpf-example.ts
```

出力例：

```
SDPF Template Labels:
Total labels: 20

  • API             | #ffb300 | API・外部サービス連携
  • BFF             | #7057ff | BFF・バックエンド連携
  • CI/CD            | #00ced1 | CI/CD・自動化
  • Component        | #008672 | Componentの追加 更新
  ... (16 more)
```

## 使用パターン

### パターン 1: JSON ファイルから読み込み

```bash
labels-config validate sdpf-labels-sample.json
```

### パターン 2: テンプレートから初期化

```bash
labels-config init sdpf --file my-labels.json
```

### パターン 3: GitHub に同期

```bash
labels-config sync \
  --token $GITHUB_TOKEN \
  --owner BoxPistols \
  --repo labels-config \
  --file sdpf-labels-sample.json
```

### パターン 4: プログラムで使用

```typescript
import { LabelManager, CONFIG_TEMPLATES } from 'labels-config-boxpistols'

// SDPF テンプレートを使用
const manager = new LabelManager({ labels: CONFIG_TEMPLATES.sdpf })

// 検索
const results = manager.search('技術')

// エクスポート
const registry = manager.exportRegistry('1.0.0', { source: 'my-project' })
```

## ラベルカテゴリ

SDPF テンプレートには以下のカテゴリが含まれています：

### 技術領域ラベル

- **API** - API・外部サービス連携
- **BFF** - BFF・バックエンド連携
- **Next.js** - Next.js 特有機能
- **Map** - 地図・マップ関連
- **UI Code** - UI コーディング・MUI・Tailwind

### 作業タイプラベル

- **Component** - Component の追加・更新
- **Docs** - ドキュメント追加・更新
- **Test** - テスト・E2E・ユニットテスト
- **Refactoring** - リファクタリング・コード整理
- **Hotfix** - 緊急修正

### 品質・最適化ラベル

- **Performance** - パフォーマンス最適化
- **TypeScript** - TypeScript 型定義
- **CI/CD** - CI/CD・自動化
- **Theme** - デザインテーマ設計
- **Turbo** - Turbo・モノレポ管理

### 企画・管理ラベル

- **仕様変更** - 仕様変更
- **機能追加** - 機能追加
- **環境構築** - 開発環境・パッケージ管理
- **画面追加** - 画面の追加・更新
- **UIUX** - UIUX デザイン

## テンプレート比較

このパッケージには複数のテンプレートが含まれています：

| テンプレート | ラベル数 | 用途 |
|-------------|--------|------|
| **minimal** | 3 | シンプルなプロジェクト |
| **github** | 9 | GitHub 標準ラベル |
| **sdpf** | 20 | Smart Drone Platform Frontend |
| **agile** | 10 | Agile/Scrum プロジェクト |

## 詳細ドキュメント

- [Getting Started Guide](../docs/GETTING_STARTED.md)
- [API Reference](../docs/API.md)
- [README](../README.md)
