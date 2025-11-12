# Examples

このディレクトリには、`@boxpistols/labels-config` の実際の使用例があります。

## Production Template Example

### JSON ファイル

[`prod-labels-sample.json`](./prod-labels-sample.json) - 本番プロジェクト向けの完全な20個のラベル定義

このファイルには、本番プロジェクトで使用可能なすべてのラベルが含まれています：

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

[`prod-example.ts`](./prod-example.ts) - Production テンプレートを使用した完全な例

実行方法：

```bash
# インストール
npm install @boxpistols/labels-config

# 例を実行
npx ts-node examples/prod-example.ts
```

出力例：

```
Production Template Labels:
Total labels: 14

  • API連携         | #ffb300 | API・外部サービス連携
  • BFF             | #7057ff | BFF・バックエンド連携
  • CI/CD           | #00ced1 | CI/CD・自動化
  • コンポーネント   | #008672 | コンポーネントの追加・更新
  ... (10 more)
```

## 使用パターン

### パターン 1: JSON ファイルから読み込み

```bash
labels-config validate prod-labels-sample.json
```

### パターン 2: テンプレートから初期化

```bash
labels-config init prod-ja --file my-labels.json
```

### パターン 3: GitHub に同期

```bash
labels-config sync \
  --owner BoxPistols \
  --repo labels-config \
  --file prod-labels-sample.json
```

### パターン 4: プログラムで使用

```typescript
import { LabelManager, CONFIG_TEMPLATES } from '@boxpistols/labels-config'

// Production テンプレートを使用
const manager = new LabelManager({ labels: CONFIG_TEMPLATES.prod })

// 検索
const results = manager.search('技術')

// エクスポート
const registry = manager.exportRegistry('1.0.0', { source: 'my-project' })
```

## ラベルカテゴリ

Production テンプレートには以下のカテゴリが含まれています：

### 技術領域ラベル

- **API連携** - API・外部サービス連携
- **BFF** - BFF・バックエンド連携
- **CI/CD** - CI/CD・自動化

### 作業タイプラベル

- **コンポーネント** - コンポーネントの追加・更新
- **ドキュメント** - ドキュメント追加・更新
- **テスト** - テスト・E2E・ユニットテスト
- **リファクタ** - リファクタリング・コード整理
- **緊急対応** - 緊急修正・Hotfix

### 品質・最適化ラベル

- **型定義** - TypeScript 型定義
- **デザイン** - UIUX デザイン

### 企画・管理ラベル

- **仕様変更** - 仕様変更
- **機能追加** - 機能追加
- **環境構築** - 開発環境・パッケージ管理
- **画面追加** - 画面の追加・更新

## テンプレート比較

このパッケージには複数のテンプレートが含まれています：

| テンプレート | ラベル数 | 用途 |
|-------------|--------|------|
| **minimal** | 3 | シンプルなプロジェクト |
| **github** | 9 | GitHub 標準ラベル |
| **prod** | 14 | 本番プロジェクト（日本語） |
| **prod-en** | 14 | 本番プロジェクト（英語） |
| **prod-ja** | 14 | 本番プロジェクト（日本語、エイリアス） |
| **react** | 10 | React エコシステム |
| **vue** | 10 | Vue.js エコシステム |
| **frontend** | 12 | フロントエンド開発全般 |
| **agile** | 10 | Agile/Scrum プロジェクト |

## 詳細ドキュメント

- [Getting Started Guide](../docs/GETTING_STARTED.md)
- [API Reference](../docs/API.md)
- [README](../README.md)
