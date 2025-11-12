# @boxpistols/labels-config

ターミナル完結型 GitHub ラベル管理 - シンプル、高速、トークン不要

gh CLI を使ってターミナルから GitHub ラベルを管理。トークンの手動設定は不要です。

---

## クイックスタート

```bash
# 1. gh CLI をインストールして認証（初回のみ）
brew install gh  # macOS
gh auth login

# 2. labels-config をインストール
npm install -g @boxpistols/labels-config

# 3. テンプレートから初期化
labels-config init minimal --file labels.json

# 4. リポジトリに同期
labels-config sync --owner your-name --repo your-repo --file labels.json
```

完了！ラベルが同期されました。

---

## 特徴

- **ターミナル完結**: トークン管理不要 - gh CLI 認証を使用
- **シンプルな CLI**: 5つのコマンド、わかりやすい使い方
- **ビルトインテンプレート**: 9種類のすぐに使えるラベルセット
- **バリデーション**: 同期前に設定をチェック
- **ドライラン**: 変更を適用前にプレビュー

---

## インストール

### 前提条件

gh CLI をインストールして認証:

```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
sudo apt install gh

# Windows
winget install --id GitHub.cli

# 認証
gh auth login
```

### labels-config をインストール

```bash
npm install -g @boxpistols/labels-config
```

---

## 使い方

### 1. ラベル設定を作成

**テンプレートから:**
```bash
labels-config init minimal --file labels.json
```

**利用可能なテンプレート:**
- `minimal` - 基本3ラベルセット（bug、feature、documentation）
- `github` - GitHub 標準ラベル
- `sdpf-ja` - プロダクションプロジェクト（日本語）
- `sdpf-en` - プロダクションプロジェクト（英語）
- `agile` - アジャイル/スクラムワークフロー
- `react`、`vue`、`frontend` - フレームワーク特化

### 2. 設定を検証

```bash
labels-config validate labels.json
```

### 3. 変更をプレビュー（ドライラン）

```bash
labels-config sync \
  --owner your-name \
  --repo your-repo \
  --file labels.json \
  --dry-run \
  --verbose
```

### 4. GitHub に同期

**追加モード**（デフォルト - 既存ラベルを保持）:
```bash
labels-config sync --owner your-name --repo your-repo --file labels.json
```

**置き換えモード**（リストにないラベルを削除）:
```bash
labels-config sync --owner your-name --repo your-repo --file labels.json --delete-extra
```

### 5. 既存ラベルをエクスポート

```bash
labels-config export --owner your-name --repo your-repo --file exported.json
```

---

## CLI コマンド

| コマンド | 説明 |
|---------|------|
| `init <template>` | テンプレートからラベル設定を作成 |
| `validate <file>` | ラベル設定を検証 |
| `sync` | ラベルを GitHub に同期 |
| `export` | GitHub からラベルをエクスポート |
| `help` | ヘルプを表示 |

### オプション

| オプション | 説明 |
|-----------|------|
| `--owner <name>` | リポジトリのオーナー |
| `--repo <name>` | リポジトリ名 |
| `--file <path>` | 設定ファイルのパス |
| `--dry-run` | 変更をプレビューのみ |
| `--delete-extra` | リストにないラベルを削除（置き換えモード） |
| `--verbose` | 詳細な出力を表示 |

---

## ラベル設定フォーマット

```json
{
  "version": "1.0.0",
  "labels": [
    {
      "name": "bug",
      "color": "d73a4a",
      "description": "何かが正常に動作していません"
    },
    {
      "name": "feature",
      "color": "0e8a16",
      "description": "新機能のリクエスト"
    }
  ]
}
```

**要件:**
- `name`: 1-50文字
- `color`: 3または6文字の16進数カラーコード（# なし）
- `description`: 1-200文字

---

## 同期モード

### 追加モード（デフォルト）
新しいラベルを追加し、既存のラベルを更新。設定にないラベルは保持されます。

```bash
labels-config sync --owner user --repo repo --file labels.json
```

### 置き換えモード
設定にないすべてのラベルを削除。完全なコントロール。

```bash
labels-config sync --owner user --repo repo --file labels.json --delete-extra
```

⚠️ **警告**: 置き換えモードはすべての Issue と PR からラベルを削除します。必ず `--dry-run` を先に実行してください！

---

## 複数リポジトリへの同期

同じラベルを複数のリポジトリに同期:

```bash
#!/bin/bash
REPOS=("org/repo1" "org/repo2" "org/repo3")

for REPO in "${REPOS[@]}"; do
  OWNER=$(echo $REPO | cut -d'/' -f1)
  REPO_NAME=$(echo $REPO | cut -d'/' -f2)

  labels-config sync \
    --owner $OWNER \
    --repo $REPO_NAME \
    --file labels.json \
    --verbose
done
```

---

## ワークフロー統合

### GitHub Actions

```yaml
name: Sync Labels

on:
  push:
    paths:
      - 'labels.json'
    branches:
      - main

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

      - name: Install gh CLI
        run: |
          sudo apt update
          sudo apt install gh -y

      - name: Authenticate gh CLI
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: echo "$GITHUB_TOKEN" | gh auth login --with-token

      - name: Sync labels
        run: |
          labels-config sync \
            --owner ${{ github.repository_owner }} \
            --repo ${{ github.event.repository.name }} \
            --file labels.json \
            --verbose
```

---

## トラブルシューティング

### 認証失敗

```bash
# gh CLI のステータスを確認
gh auth status

# 再認証
gh auth login

# 認証をリフレッシュ
gh auth refresh
```

### バリデーションエラー

```bash
# 具体的なエラーを確認
labels-config validate labels.json

# よくある問題:
# - ラベル名の重複
# - 無効な16進数カラー（# なしで3または6文字）
# - 名前が長すぎる（最大50文字）
# - 説明が長すぎる（最大200文字）
```

### ラベルが同期されない

```bash
# 詳細な出力で確認
labels-config sync --owner user --repo repo --file labels.json --verbose

# ドライランで何が変更されるか確認
labels-config sync --owner user --repo repo --file labels.json --dry-run --verbose
```

### レート制限超過

```bash
# レート制限のステータスを確認
gh api rate_limit

# リセットを待つ（通常60分）
```

---

## ベストプラクティス

**✅ すべきこと:**
- `labels.json` をバージョン管理に含める
- 実際の同期前に `--dry-run` を実行
- セマンティックなコミットメッセージを使用
- プロジェクトでラベルの目的を文書化
- プロジェクト間で一貫した色使いをする

**❌ すべきでないこと:**
- Issue/PR での使用状況を確認せずにラベルを削除
- ラベル名を頻繁に変更
- 同期前のバリデーションをスキップ

---

## 高度な使用方法

### npm パッケージとして使用

コード内でライブラリとして使用することもできます:

```typescript
import { GitHubLabelSync } from '@boxpistols/labels-config/github'
import { CONFIG_TEMPLATES } from '@boxpistols/labels-config'

const sync = new GitHubLabelSync({
  owner: 'your-org',
  repo: 'your-repo'
})

const labels = CONFIG_TEMPLATES.minimal
await sync.syncLabels(labels)
```

プロジェクトにインストール:
```bash
npm install @boxpistols/labels-config
```

---

## ライセンス

MIT

---

## 関連

- [English README](./README.md)

---

**gh CLI を愛するターミナルユーザーのために作られました** 🚀
