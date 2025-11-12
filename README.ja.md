# @boxpistols/labels-config

GitHub リポジトリと開発チームのための包括的なラベル管理システム

GitHub ラベルの定義、検証、同期を強力なスキーマベースの設定システムで実現。**基本的な使用には GitHub Token は不要** - 9 種類のビルトインテンプレート、TypeScript でのカスタムラベル定義、またはラベル設定ファイルの生成が可能です。

**使用方法:**
- 📦 npm パッケージとしてコード内で使用（トークン不要）
- 🛠️ CLI ツールでラベルファイルの生成と検証（トークン不要）
- 🔄 GitHub 同期ツール（GitHub Token が必要）

---

## 📑 目次

- [特徴](#特徴)
- [インストール](#インストール)
- [クイックスタート](#クイックスタート)
- [詳細な使用方法ガイド](#詳細な使用方法ガイド)
  - [ステップ 1: インストールとセットアップ](#ステップ-1-インストールとセットアップ)
  - [ステップ 2: テンプレートを選択](#ステップ-2-テンプレートを選択)
  - [ステップ 3: ラベルをカスタマイズ](#ステップ-3-ラベルをカスタマイズ)
  - [ステップ 4: 変更をプレビュー（ドライラン）](#ステップ-4-変更をプレビュードライラン)
  - [ステップ 5: GitHub に同期](#ステップ-5-github-に同期)
  - [ステップ 6: 既存のラベルをエクスポート](#ステップ-6-既存のラベルをエクスポート)
- [運用・更新マニュアル](#運用更新マニュアル)
- [ラベルテンプレート](#ラベルテンプレート)
- [トラブルシューティング](#トラブルシューティング)

---

## 特徴

- **9 種類のビルトインテンプレート**: React、Vue、フロントエンド、アジャイルワークフローなどのすぐに使えるラベルセット
- **GitHub Token 不要**（基本的な使用時）: npm パッケージとして使用、ラベルファイルの生成、設定の検証が可能
- **スキーマベースの設定**: Zod バリデーションによるラベル定義
- **型安全**: 完全な TypeScript サポートと自動生成される型
- **CLI ツール**: ラベル管理のためのコマンドラインインターフェース
- **オプションの GitHub 統合**: GitHub リポジトリへのラベル同期（GitHub Token が必要）
- **マルチフォーマット配布**: npm、ESM、UMD、CDN サポート
- **バイリンガル対応**: 英語と日本語のラベルテンプレート（sdpf-en、sdpf-ja）

---

## インストール

### npm でインストール

```bash
npm install @boxpistols/labels-config
```

### グローバルインストール（CLI 使用時）

```bash
npm install -g @boxpistols/labels-config
```

### CDN で使用

```html
<script src="https://cdn.jsdelivr.net/npm/@boxpistols/labels-config/dist/index.umd.js"></script>
```

---

## クイックスタート

### 使用例 1: npm パッケージとして使用（GitHub Token 不要）

ビルトインテンプレートを使用、またはカスタムラベルを定義:

```typescript
import { CONFIG_TEMPLATES } from '@boxpistols/labels-config'

// ビルトインテンプレートを使用
const reactLabels = CONFIG_TEMPLATES.react
const vueLabels = CONFIG_TEMPLATES.vue
const sdpfLabels = CONFIG_TEMPLATES['sdpf-ja']

// ラベルのプロパティにアクセス
reactLabels.forEach(label => {
  console.log(`${label.name}: #${label.color}`)
})
```

TypeScript でカスタムラベルを定義:

```typescript
import { LabelConfig, validateLabels } from '@boxpistols/labels-config'

const customLabels: LabelConfig[] = [
  {
    name: 'bug',
    color: 'd73a4a',
    description: '何かが正常に動作していません'
  },
  {
    name: 'feature',
    color: '0e8a16',
    description: '新機能またはリクエスト'
  }
]

// ラベルを検証（フォーマット、重複などをチェック）
const validated = validateLabels(customLabels)
```

### 使用例 2: CLI - ラベルファイルの生成（GitHub Token 不要）

```bash
# テンプレートからラベル設定を生成
labels-config init react --file labels.json

# ラベル設定を検証
labels-config validate labels.json
```

### 使用例 3: CLI - GitHub に同期（GitHub Token が必要）

```bash
# GitHub にラベルを同期（追加モード - 既存のラベルを保持）
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json

# GitHub にラベルを同期（置換モード - リストにないラベルを削除）
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json --delete-extra

# GitHub から既存のラベルをエクスポート
labels-config export --token $GITHUB_TOKEN --owner user --repo repo --output labels.json
```

### 使用例 4: プログラムによる GitHub 同期（GitHub Token が必要）

```typescript
import { GitHubLabelSync } from '@boxpistols/labels-config/github'
import { CONFIG_TEMPLATES } from '@boxpistols/labels-config'

const sync = new GitHubLabelSync({
  token: process.env.GITHUB_TOKEN,
  owner: 'your-org',
  repo: 'your-repo'
})

// リポジトリにラベルを同期
const labels = CONFIG_TEMPLATES.react
await sync.syncLabels(labels)
```

---

## 詳細な使用方法ガイド

### 重要: GitHub Token は必要ですか？

**GitHub Token が必要なのは以下の場合のみ:**
- ✅ GitHub リポジトリへのラベル同期（`sync` コマンド）
- ✅ GitHub リポジトリからのラベルエクスポート（`export` コマンド）

**GitHub Token が不要なのは以下の場合:**
- ❌ コード内で npm パッケージとして使用
- ❌ テンプレートからラベルファイルを生成（`init` コマンド）
- ❌ ラベルファイルの検証（`validate` コマンド）
- ❌ TypeScript/JavaScript でラベルを定義・管理

**コード内でラベルを定義するだけなら、GitHub Token のセットアップはスキップできます。**

---

### ステップ 1: インストールとセットアップ

#### 1.1 パッケージのインストール

**CLI 使用の場合:**
```bash
npm install -g @boxpistols/labels-config
```

**プロジェクト内でライブラリとして使用する場合:**
```bash
npm install @boxpistols/labels-config
```

**開発/CI 用:**
```bash
npm install --save-dev @boxpistols/labels-config
```

#### 1.2 GitHub Token のセットアップ（オプション - 同期/エクスポートのみ）

**⚠️ パッケージをライブラリとしてのみ使用する場合、またはラベルファイルの生成のみの場合は、このステップをスキップしてください。**

`repo` スコープを持つ GitHub Personal Access Token を作成:

1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic) に移動
2. "Generate new token (classic)" をクリック
3. スコープを選択: `repo`（プライベートリポジトリの完全な制御）
4. トークンをコピーして安全に保存

環境変数としてトークンを設定:

```bash
# ~/.bashrc または ~/.zshrc に追加
export GITHUB_TOKEN="your_token_here"

# または .env ファイルを作成（コミットしないでください！）
echo "GITHUB_TOKEN=your_token_here" > .env
```

---

### ステップ 2: テンプレートを選択

#### 2.1 利用可能なテンプレートを一覧表示

```bash
labels-config help
```

プロジェクトに合った 9 種類のテンプレートから選択:

- **minimal**: 基本的なニーズに対応したシンプルなプロジェクト
- **github**: 標準的な GitHub ワークフロー
- **react**: React ベースのフロントエンドプロジェクト
- **vue**: Vue.js ベースのフロントエンドプロジェクト
- **frontend**: 一般的なフロントエンドプロジェクト（フレームワーク非依存）
- **sdpf-en**: 本番プロジェクト（英語ラベル）
- **sdpf-ja**: 本番プロジェクト（日本語ラベル）
- **agile**: アジャイル/スクラム開発ワークフロー

#### 2.2 テンプレートから初期化

```bash
# React プロジェクト用
labels-config init react --file labels.json

# Vue プロジェクト用
labels-config init vue --file labels.json

# 一般的なフロントエンドプロジェクト用
labels-config init frontend --file labels.json

# 本番プロジェクト用（日本語）
labels-config init sdpf-ja --file labels.json

# 本番プロジェクト用（英語）
labels-config init sdpf-en --file labels.json
```

---

### ステップ 3: ラベルをカスタマイズ

#### 3.1 生成されたファイルを確認

`labels.json` を開いてラベルを確認:

```bash
cat labels.json
```

#### 3.2 ラベルをカスタマイズ

JSON ファイルを編集してラベルを追加、変更、削除:

```json
{
  "version": "1.0.0",
  "timestamp": "2025-11-12T00:00:00.000Z",
  "labels": [
    {
      "name": "bug",
      "color": "d73a4a",
      "description": "何かが正常に動作していません"
    },
    {
      "name": "feature",
      "color": "0e8a16",
      "description": "新機能またはリクエスト"
    }
  ]
}
```

**ラベルフォーマットの要件:**
- `name`: 1〜50 文字、英数字、ハイフン、スペース、スラッシュ（/、CI/CD 用）、日本語文字
- `color`: 3 文字または 6 文字の 16 進数コード（# なし）
- `description`: 1〜200 文字

#### 3.3 設定を検証

同期する前に、必ず検証を実行:

```bash
labels-config validate labels.json
```

検証内容:
- 有効な 16 進数カラーコード
- 重複するラベル名
- 適切な JSON フォーマット
- 文字数制限

---

### ステップ 4: 変更をプレビュー（ドライラン）

GitHub リポジトリに変更を加える前に、何が起こるかをプレビュー:

```bash
labels-config sync \
  --token $GITHUB_TOKEN \
  --owner your-username \
  --repo your-repo \
  --file labels.json \
  --dry-run \
  --verbose
```

**ドライランで表示される内容:**
- 作成されるラベル（新規）
- 更新されるラベル（既存、変更あり）
- 削除されるラベル（`--delete-extra` 使用時）
- 変更されないラベル

---

### ステップ 5: GitHub に同期

#### 5.1 初回同期（追加モード）

初回同期では、既存のラベルを保持する追加モードを使用:

```bash
labels-config sync \
  --token $GITHUB_TOKEN \
  --owner your-username \
  --repo your-repo \
  --file labels.json \
  --verbose
```

動作内容:
- ✅ 設定から新しいラベルを追加
- ✅ 色/説明が変更された場合、既存のラベルを更新
- ✅ 設定にないラベルを保持

#### 5.2 完全置換（置換モード）

確信が持てたら、完全な制御のために置換モードを使用:

```bash
labels-config sync \
  --token $GITHUB_TOKEN \
  --owner your-username \
  --repo your-repo \
  --file labels.json \
  --delete-extra \
  --verbose
```

動作内容:
- ✅ 設定から新しいラベルを追加
- ✅ 色/説明が変更された場合、既存のラベルを更新
- ❌ 設定にないラベルを削除

⚠️ **警告**: 置換モードはラベルを削除します。必ず最初に `--dry-run` を実行してください！

---

### ステップ 6: 既存のラベルをエクスポート

リポジトリから現在のラベルをエクスポート:

```bash
labels-config export \
  --token $GITHUB_TOKEN \
  --owner your-username \
  --repo your-repo \
  --file exported-labels.json
```

用途:
- 既存のラベルをバックアップ
- リポジトリ間でラベルを移行
- カスタマイズのベースを作成

---

## 運用・更新マニュアル

### 継続的なラベル管理

#### 1. 定期メンテナンスワークフロー

**継続的なラベル管理のための推奨ワークフロー:**

```bash
# 1. labels.json をバージョン管理に含める
git add labels.json
git commit -m "ラベル定義を更新"

# 2. 同期前に必ず検証
labels-config validate labels.json

# 3. ドライランで変更をプレビュー
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json --dry-run --verbose

# 4. 変更を適用
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json --verbose
```

#### 2. 新しいラベルの追加

プロジェクトに新しいラベルを追加するには:

1. **labels.json を編集:**

```json
{
  "labels": [
    // ... 既存のラベル ...
    {
      "name": "security",
      "color": "ee0701",
      "description": "セキュリティ関連の問題"
    }
  ]
}
```

2. **変更を検証:**

```bash
labels-config validate labels.json
```

3. **プレビューして適用:**

```bash
# 最初にドライラン
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json --dry-run --verbose

# 変更を適用
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json --verbose
```

#### 3. 既存のラベルの変更

ラベルの色や説明を更新するには:

1. **labels.json でラベルを編集**
2. **検証して同期**（追加と同じ手順）

同期により、そのラベルを使用している issue/PR に影響を与えることなく、既存のラベルが自動的に更新されます。

#### 4. ラベルの削除

**オプション A: 安全な削除（追加モード）**
- labels.json から削除
- `--delete-extra` なしで同期
- ラベルは GitHub に残りますが、管理されなくなります

**オプション B: 完全な削除（置換モード）**
```bash
# labels.json から削除してから:
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json --delete-extra --verbose
```

⚠️ **警告**: ラベルを削除すると、そのラベルを使用しているすべての issue と PR から削除されます！

#### 5. 複数リポジトリの管理

**複数のリポジトリでラベルを管理:**

**方法 1: スクリプトベースのアプローチ**

同期スクリプト（`sync-labels.sh`）を作成:

```bash
#!/bin/bash

REPOS=(
  "org/repo1"
  "org/repo2"
  "org/repo3"
)

for REPO in "${REPOS[@]}"; do
  echo "Syncing labels to $REPO..."

  # org/repo を分割
  OWNER=$(echo $REPO | cut -d'/' -f1)
  REPO_NAME=$(echo $REPO | cut -d'/' -f2)

  # ラベルを同期
  labels-config sync \
    --token $GITHUB_TOKEN \
    --owner $OWNER \
    --repo $REPO_NAME \
    --file labels.json \
    --verbose

  echo "✓ Completed $REPO"
  echo "---"
done

echo "All repositories synced!"
```

実行可能にして実行:

```bash
chmod +x sync-labels.sh
./sync-labels.sh
```

**方法 2: GitHub Actions（自動化）**

`.github/workflows/sync-labels.yml` を作成:

```yaml
name: Sync Labels

on:
  push:
    paths:
      - 'labels.json'
    branches:
      - main
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install labels-config
        run: npm install -g @boxpistols/labels-config

      - name: Validate labels
        run: labels-config validate labels.json

      - name: Sync labels
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          labels-config sync \
            --token $GITHUB_TOKEN \
            --owner ${{ github.repository_owner }} \
            --repo ${{ github.event.repository.name }} \
            --file labels.json \
            --verbose
```

#### 6. ベストプラクティス

**✅ 推奨事項:**
- `labels.json` をバージョン管理に含める
- ラベル変更にはセマンティックなコミットメッセージを使用
- 実際の同期前に `--dry-run` を実行
- プロジェクトの README でラベル分類を文書化
- 定期的にラベルの使用状況を確認（未使用のラベルを削除）
- プロジェクト間で一貫した色コーディングを使用

**❌ 避けるべきこと:**
- GitHub トークンをバージョン管理にコミットしない
- issue/PR での使用状況を確認せずにラベルを削除しない
- ラベル名を頻繁に変更しない（ワークフローが壊れる可能性があります）
- 曖昧または重複する意味のラベルを使用しない

#### 7. チーム協業

**チームベースのラベル管理:**

1. **ラベルオーナーを指定** - ラベル定義の責任者を一人決める
2. **プルリクエストを使用** - コードと同様にラベル変更をレビュー
3. **ラベルの目的を文書化** - 各ラベルをいつ使用するかを説明
4. **定期的なレビュー** - 四半期ごとにラベルの有効性をレビュー
5. **移行計画** - ラベル名を変更する際は、移行ガイダンスを提供

**ラベルドキュメントの例:**

```markdown
# 当社のラベルシステム

## 優先度ラベル
- `priority:critical`（赤）- 即座に修正が必要
- `priority:high`（オレンジ）- このスプリント内に修正すべき
- `priority:medium`（黄）- 近いうちに修正すべき
- `priority:low`（緑）- 延期可能

## タイプラベル
- `bug` - 何かが壊れている
- `feature` - 新機能
- `refactor` - 動作を変更しないコード改善
```

---

## トラブルシューティング

### 問題: "Validation failed"（検証失敗）

```bash
# 特定のエラーを確認
labels-config validate labels.json

# よくある問題:
# - 重複するラベル名
# - 無効な 16 進数カラー（3 文字または 6 文字である必要があります）
# - 名前が長すぎる（最大 50 文字）
# - 説明が長すぎる（最大 200 文字）
```

### 問題: "Authentication failed"（認証失敗）

```bash
# トークンを確認
echo $GITHUB_TOKEN

# トークンのスコープを確認:
# https://github.com/settings/tokens

# 必要なスコープ: repo
```

### 問題: "Label already exists"（ラベルは既に存在します）

- これは正常です - ツールは既存のラベルを更新します
- 何が変更されたかを確認するには `--verbose` を使用

### 問題: "Labels not syncing"（ラベルが同期されない）

```bash
# 最大の詳細度で試す
labels-config sync \
  --token $GITHUB_TOKEN \
  --owner user \
  --repo repo \
  --file labels.json \
  --verbose

# ドライランで変更が表示されるか確認
labels-config sync ... --dry-run --verbose
```

### 問題: "Rate limit exceeded"（レート制限を超えました）

- GitHub API にはレート制限があります
- 60 分待つか、別のトークンを使用してください
- 一括操作の場合は、同期の間に遅延を追加してください

---

## ラベルテンプレート

このパッケージには、フロントエンド開発に重点を置いた 9 種類のビルトインラベルテンプレートが含まれています:

### 1. **minimal**（3 ラベル）
必須ラベルを含む基本的なスターターセット。

### 2. **github**（9 ラベル）
標準的な GitHub デフォルトラベル（bug、enhancement、documentation など）。

### 3. **react**（10 ラベル）
React エコシステム: コンポーネント、フック、状態管理、TypeScript、テスト、スタイリング、パフォーマンス、アクセシビリティ。

### 4. **vue**（10 ラベル）
Vue.js エコシステム: コンポーネント、コンポーザブル、Pinia、Vue Router、TypeScript、テスト、スタイリング、パフォーマンス、アクセシビリティ。

### 5. **frontend**（12 ラベル）
フレームワーク非依存のフロントエンド開発: 機能、UI/UX、レスポンシブデザイン、アクセシビリティ、SEO、ビルドシステム、依存関係。

### 6. **sdpf-en**（14 ラベル、英語）
国際チーム向けの英語ラベルを含む本番プロジェクトセット。

### 7. **sdpf-ja**（14 ラベル、日本語）
国内開発チーム向けの日本語ラベルを含む本番プロジェクトセット。

### 8. **sdpf**（14 ラベル、日本語）
`sdpf-ja` のエイリアス - 後方互換性のために維持。

### 9. **agile**（10 ラベル）
アジャイル/スクラムワークフロー: ストーリー、タスク、スパイク、優先度、ブロッカー。

### 使用方法

```typescript
import { CONFIG_TEMPLATES } from '@boxpistols/labels-config'

// テンプレートを使用
const reactLabels = CONFIG_TEMPLATES.react
const vueLabels = CONFIG_TEMPLATES.vue
const frontendLabels = CONFIG_TEMPLATES.frontend

// SDPF の言語を選択
const sdpfEnglish = CONFIG_TEMPLATES['sdpf-en']
const sdpfJapanese = CONFIG_TEMPLATES['sdpf-ja']
// またはデフォルト（日本語）を使用
const sdpfDefault = CONFIG_TEMPLATES.sdpf
```

---

## 同期モード

GitHub にラベルを同期する際、2 つのモードから選択できます:

### 追加モード（デフォルト）
新しいラベルを追加し、既存のものを更新しますが、設定にないラベルは保持します。

```bash
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json
```

### 置換モード
設定にないすべてのラベルを削除し、完全な制御を提供します。

```bash
labels-config sync --token $GITHUB_TOKEN --owner user --repo repo --file labels.json --delete-extra
```

**推奨**: 初期セットアップ時は追加モードを使用し、ラベルセットが確定したら置換モードに切り替えてください。

---

## 設定フォーマット

ラベルは JSON または TypeScript オブジェクトとして定義されます:

```json
[
  {
    "name": "Component",
    "color": "008672",
    "description": "コンポーネントの変更"
  },
  {
    "name": "Bug",
    "color": "ff0000",
    "description": "バグ修正"
  }
]
```

---

## API リファレンス

### `LabelConfig`

```typescript
interface LabelConfig {
  name: string          // ラベル名（一意）
  color: string         // 16 進数カラーコード（# なし）
  description: string   // 人間が読める説明
}
```

### `validateLabels()`

スキーマに対してラベルを検証します。

```typescript
function validateLabels(labels: unknown): LabelConfig[]
```

### `GitHubLabelSync`

GitHub ラベルの同期を管理します。

```typescript
class GitHubLabelSync {
  constructor(options: GitHubSyncOptions)
  syncLabels(labels: LabelConfig[]): Promise<void>
  fetchLabels(): Promise<LabelConfig[]>
  deleteLabel(name: string): Promise<void>
  updateLabel(name: string, config: Partial<LabelConfig>): Promise<void>
}
```

---

## コントリビューション

コントリビューションを歓迎します！コントリビューションガイドラインをお読みください。

---

## ライセンス

MIT

---

## 関連ドキュメント

- [English README](./README.md)
- [Getting Started Guide](./docs/GETTING_STARTED.md)
- [API Documentation](./docs/API.md)
