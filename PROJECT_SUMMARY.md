# @boxpistols/labels-config - プロジェクトサマリー

## 概要

`@boxpistols/labels-config` は、GitHub ラベルの包括的な管理システムです。元の `sdpf-frontend-next` リポジトリの `shells/labels.json` アーキテクチャをベースに、npm パッケージおよび CDN 配布対応の OSS として実装されました。

## 主な機能

### 1. **ラベル管理エンジン**
- Zod ベースのスキーマ検証
- TypeScript での完全な型安全性
- ラベルの CRUD 操作
- 検索・フィルター機能
- 重複検出

### 2. **GitHub 統合**
- GitHub API による自動同期
- ドライランモード
- バッチ操作
- エラーハンドリング

### 3. **設定管理**
- JSON ベースの設定ファイル
- 複数のテンプレート（minimal, github, sdpf, agile）
- レジストリ形式対応
- カテゴリー分類対応

### 4. **CLI ツール**
```bash
labels-config init sdpf --file labels.json
labels-config validate ./labels.json
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo
labels-config export --token $GITHUB_TOKEN --owner user --repo repo
```

### 5. **マルチフォーマット配布**
- npm パッケージ（CJS, ESM）
- UMD ビルド
- CDN 配信（jsDelivr, unpkg）
- TypeScript 型定義

## プロジェクト構成

```
labels-config/
├── src/                          # ソースコード
│   ├── index.ts                 # メインエントリーポイント
│   ├── types.ts                 # 型定義
│   ├── validation.ts            # バリデーション
│   ├── manager.ts               # ラベルマネージャー
│   ├── cli.ts                   # CLI ツール
│   ├── config/                  # 設定モジュール
│   │   ├── index.ts
│   │   ├── loader.ts           # ファイルローダー
│   │   └── templates.ts        # プリセットテンプレート
│   ├── github/                  # GitHub 統合
│   │   ├── index.ts
│   │   ├── client.ts           # GitHub API クライアント
│   │   └── sync.ts             # 同期エンジン
│   ├── *.test.ts               # テスト
│   └── version.ts              # バージョン
├── docs/                        # ドキュメント
│   ├── GETTING_STARTED.md       # スタートガイド
│   └── API.md                   # API リファレンス
├── templates/                   # ラベルテンプレート
│   └── sdpf-labels.json
├── .github/workflows/           # CI/CD
│   ├── test.yml                # テスト ワークフロー
│   └── publish.yml             # 公開 ワークフロー
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── .eslintrc.json
├── README.md
├── SETUP.md
├── CONTRIBUTING.md
└── LICENSE
```

## 技術スタック

| 領域 | 技術 |
|------|------|
| **言語** | TypeScript 5.3+ |
| **ランタイム** | Node.js 18+ |
| **検証** | Zod 3.22+ |
| **GitHub API** | Octokit 3.1+ |
| **テスト** | Vitest 1.0+ |
| **リント** | ESLint + TypeScript |
| **ビルド** | tsup 8.0+ |
| **ドキュメント** | Markdown |

## API の使用例

### TypeScript/JavaScript

```typescript
import { LabelManager } from '@boxpistols/labels-config'
import { GitHubLabelSync } from '@boxpistols/labels-config/github'

// マネージャーで管理
const manager = new LabelManager()
manager.addLabel({ name: 'bug', color: 'ff0000', description: 'Bug' })

// GitHub に同期
const sync = new GitHubLabelSync({
  token: process.env.GITHUB_TOKEN,
  owner: 'user',
  repo: 'repo'
})
await sync.syncLabels(manager.export())
```

### CLI

```bash
# テンプレートから初期化
labels-config init sdpf --file labels.json

# GitHub に同期
labels-config sync \
  --token $GITHUB_TOKEN \
  --owner user \
  --repo repo \
  --file labels.json
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@boxpistols/labels-config/dist/index.umd.js"></script>
<script>
  const { validateLabels } = window.LabelsConfig
</script>
```

## テンプレート

### SDPF（元のラベル定義）
API, BFF, CI/CD, Component, Docs, Hotfix, Map, Next.js, Performance, Refactoring, Test, Theme, Turbo, TypeScript, UI Code, UIUX, 仕様変更, 機能追加, 環境構築, 画面追加

### GitHub 標準
bug, documentation, duplicate, enhancement, good first issue, help wanted, invalid, question, wontfix

### Agile/Scrum
story, task, spike, bug, debt, blocked, priority:critical, priority:high, priority:medium, priority:low

### カスタム
ユーザー定義可能

## デプロイメント手順

1. **GitHub リポジトリ作成**
   ```bash
   git remote add origin https://github.com/BoxPistols/labels-config.git
   git push -u origin main
   ```

2. **npm に公開**
   ```bash
   npm login
   npm publish --access public
   ```

3. **GitHub Actions シークレット設定**
   - `NPM_TOKEN` を設定

4. **リリース作成**
   - GitHub から Release を作成すると自動公開

## npm パッケージ情報

- **パッケージ名**: `@boxpistols/labels-config`
- **公開アクセス**: Public
- **ライセンス**: MIT
- **プレフィックス**: @boxpistols（スコープ付き）

## CI/CD パイプライン

### テスト ワークフロー
- Node.js 18.x, 20.x で実行
- Type checking, Linting, Tests, Build を自動実行

### 公開 ワークフロー
- Release 作成時に npm に自動公開
- UMD ビルドも生成

## セキュリティ

- npm token は GitHub Secrets で管理
- 型安全性を徹底（strict: true）
- バリデーション検証は Zod で実装
- 公開 API は明示的に export

## ドキュメント

1. **README.md** - 概要と quick start
2. **GETTING_STARTED.md** - インストール・基本的な使用方法
3. **API.md** - 完全な API リファレンス
4. **CONTRIBUTING.md** - コントリビューション ガイドライン
5. **SETUP.md** - 本番環境へのデプロイ手順

## 今後の拡張可能性

- [ ] React コンポーネント（ラベルの UI 表示）
- [ ] Web Dashboard（ラベル管理 UI）
- [ ] GitHub Apps 統合
- [ ] Webhook サポート
- [ ] 複数リポジトリ一括管理
- [ ] ラベルテンプレートマーケットプレイス
- [ ] GraphQL API サポート

## バージョン管理

**現在のバージョン**: 0.1.0

セマンティック バージョニングを採用：
- **MAJOR**: 破壊的変更
- **MINOR**: 新機能（後方互換性あり）
- **PATCH**: バグ修正

## サポート

- GitHub Issues でバグ報告・機能リクエスト
- GitHub Discussions でコミュニティサポート
- CONTRIBUTING.md でコントリビューション方法

## ライセンス

MIT License - 自由に使用・改変・配布可能

## 初期作成情報

- **ベース**: sdpf-frontend-next の shells/labels.json
- **作成日**: 2024-11-12
- **言語**: TypeScript 5.3+
- **Node.js**: 18+

---

このプロジェクトは、元のラベル定義アーキテクチャを保ちながら、スケーラブルな OSS パッケージとして実装されています。

