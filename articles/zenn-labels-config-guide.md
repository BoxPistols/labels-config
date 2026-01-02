---
title: "GitHubラベル管理を自動化！labels-configでチーム開発を効率化する"
emoji: "🏷️"
type: "tech"
topics: ["github", "cli", "nodejs", "npm", "開発効率化"]
published: true
---

# TL;DR - 忙しい人向け（1分で導入）

:::message
**前提:** GitHub CLI (`gh`) がインストール・認証済みであること
:::

```bash
# 1. インストール
npm install -g @asagiri-design/labels-config

# 2. 日本語ラベルテンプレートで設定ファイル作成
labels-config init prod-ja --file labels.json

# 3. ドライランで確認（実際には変更しない）
labels-config sync --owner YOUR_ORG --repo YOUR_REPO --file labels.json --delete-extra --dry-run

# 4. 実行（既存の英語ラベルを削除して日本語ラベルに置き換え）
labels-config sync --owner YOUR_ORG --repo YOUR_REPO --file labels.json --delete-extra
```

**ポイント:**
- `--delete-extra` で設定ファイルにないラベル（GitHubデフォルトの英語ラベル等）を削除
- 必ず `--dry-run` で確認してから実行

---

# はじめに

GitHubのIssueやPRに付けるラベル、チームやプロジェクトで統一できていますか？

複数のリポジトリを管理していると、ラベルがバラバラになりがちです。新しいリポジトリを作るたびに、手動でラベルを作成するのは面倒ですよね。

そこで今回紹介するのが **`@asagiri-design/labels-config`** です。

**ターミナルから1コマンドで、GitHubリポジトリのラベルを設定ファイルと同期できます。**

## このツールでできること

- 設定ファイル（JSON）でラベルを一元管理
- 9種類の組み込みテンプレートから選択可能
- ドライランで変更をプレビュー
- 複数リポジトリへの一括同期
- GitHub Actionsで自動化

# クイックスタート（5分で完了）

## Step 1: GitHub CLIのセットアップ

このツールは `gh` CLI を使用してGitHub APIと通信します。トークンの手動管理は不要です。

```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
sudo apt install gh

# Windows
winget install --id GitHub.cli

# 認証（ブラウザが開きます）
gh auth login
```

## Step 2: labels-configをインストール

```bash
npm install -g @asagiri-design/labels-config
```

インストール確認：

```bash
labels-config --version
```

## Step 3: ラベル設定ファイルを作成

テンプレートから設定ファイルを生成します：

```bash
labels-config init prod-ja --file labels.json
```

これで `labels.json` が作成されます。中身を確認してみましょう：

```bash
cat labels.json
```

## Step 4: GitHubリポジトリに同期

まずはドライランで変更内容を確認：

```bash
labels-config sync \
  --owner YOUR_USERNAME \
  --repo YOUR_REPO \
  --file labels.json \
  --dry-run \
  --verbose
```

問題なければ、実際に同期：

```bash
labels-config sync \
  --owner YOUR_USERNAME \
  --repo YOUR_REPO \
  --file labels.json \
  --verbose
```

これで完了です！GitHubリポジトリのラベルが設定ファイルと同期されました。

# 利用可能なテンプレート

| テンプレート | 説明 | ラベル数 |
|-------------|------|---------|
| `minimal` | 最小構成（bug, feature, documentation） | 3 |
| `github` | GitHubデフォルトラベル | 9 |
| `prod-ja` | 日本語プロダクション用 | 14 |
| `prod-en` | 英語プロダクション用 | 14 |
| `agile` | アジャイル/スクラム用 | 12 |
| `react` | React開発用 | 15 |
| `vue` | Vue開発用 | 15 |
| `frontend` | フロントエンド汎用 | 15 |

テンプレート一覧を表示：

```bash
labels-config init --help
```

# CLIコマンド一覧

## init - 設定ファイルの作成

```bash
# テンプレートから作成
labels-config init <template> --file <出力ファイル>

# 例
labels-config init prod-ja --file labels.json
labels-config init agile --file my-labels.json
```

## validate - 設定ファイルの検証

同期前に設定ファイルが正しいかチェック：

```bash
labels-config validate labels.json
```

チェック項目：
- ラベル名の重複
- カラーコードの形式（3桁または6桁の16進数）
- 名前の長さ（最大50文字）
- 説明の長さ（最大200文字）

## sync - GitHubへの同期

```bash
labels-config sync \
  --owner <オーナー名> \
  --repo <リポジトリ名> \
  --file <設定ファイル> \
  [オプション]
```

### オプション

| オプション | 説明 |
|-----------|------|
| `--dry-run` | 実際には変更せず、プレビューのみ |
| `--verbose` | 詳細なログを表示 |
| `--delete-extra` | 設定ファイルにないラベルを削除 |

### 同期モード

**追加モード（デフォルト）**
- 新しいラベルを追加
- 既存ラベルを更新（名前が同じ場合）
- 設定ファイルにないラベルは**そのまま残す**

```bash
labels-config sync --owner user --repo repo --file labels.json
```

**置き換えモード**
- 設定ファイルにないラベルを**削除する**
- 完全に設定ファイルと同じ状態にする

```bash
labels-config sync --owner user --repo repo --file labels.json --delete-extra
```

:::message alert
置き換えモードは既存のIssue/PRからラベルが外れる可能性があります。必ず `--dry-run` で確認してから実行してください。
:::

## export - 既存ラベルのエクスポート

既存リポジトリのラベルを設定ファイルとして出力：

```bash
labels-config export \
  --owner YOUR_USERNAME \
  --repo YOUR_REPO \
  --file exported-labels.json
```

他のリポジトリにラベルをコピーしたいときに便利です。

# 設定ファイルのフォーマット

## 基本形式

```json
{
  "version": "1.0.0",
  "labels": [
    {
      "name": "bug",
      "color": "d73a4a",
      "description": "バグ報告"
    },
    {
      "name": "feature",
      "color": "0e8a16",
      "description": "新機能リクエスト"
    },
    {
      "name": "documentation",
      "color": "0075ca",
      "description": "ドキュメントの改善"
    }
  ]
}
```

### フィールド説明

| フィールド | 必須 | 説明 |
|-----------|------|------|
| `name` | ○ | ラベル名（1-50文字） |
| `color` | ○ | 16進数カラーコード（`#`なし、3桁または6桁） |
| `description` | ○ | ラベルの説明（1-200文字） |

## カテゴリ分け形式

ラベルをカテゴリごとに整理することもできます：

```json
{
  "version": "1.0.0",
  "labels": [
    {
      "category": "タイプ",
      "labels": [
        { "name": "bug", "color": "d73a4a", "description": "バグ" },
        { "name": "feature", "color": "0e8a16", "description": "新機能" }
      ]
    },
    {
      "category": "優先度",
      "labels": [
        { "name": "priority:high", "color": "ff0000", "description": "高" },
        { "name": "priority:low", "color": "cccccc", "description": "低" }
      ]
    }
  ]
}
```

# 実践的なユースケース

## ケース1: 新規プロジェクトのセットアップ

新しいリポジトリを作ったらすぐにラベルを設定：

```bash
# 1. プロジェクトに合ったテンプレートを選択
labels-config init prod-ja --file labels.json

# 2. 必要に応じてlabels.jsonを編集
vim labels.json

# 3. 検証
labels-config validate labels.json

# 4. 同期
labels-config sync --owner myorg --repo new-project --file labels.json
```

## ケース2: 既存ラベルを他リポジトリにコピー

```bash
# 1. 既存リポジトリからエクスポート
labels-config export --owner myorg --repo main-project --file labels.json

# 2. 別リポジトリに同期
labels-config sync --owner myorg --repo sub-project --file labels.json
```

## ケース3: 複数リポジトリへの一括同期

シェルスクリプトで複数リポジトリに同期：

```bash
#!/bin/bash
REPOS=("myorg/repo1" "myorg/repo2" "myorg/repo3")

for REPO in "${REPOS[@]}"; do
  OWNER=$(echo $REPO | cut -d'/' -f1)
  REPO_NAME=$(echo $REPO | cut -d'/' -f2)

  echo "Syncing $REPO..."
  labels-config sync \
    --owner $OWNER \
    --repo $REPO_NAME \
    --file labels.json \
    --verbose
done
```

# GitHub Actionsで自動化

`labels.json` を変更したら自動で同期する設定：

```yaml
# .github/workflows/sync-labels.yml
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
          node-version: '20'

      - name: Install labels-config
        run: npm install -g @asagiri-design/labels-config

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

これで、`labels.json` をコミットするだけでラベルが自動更新されます。

# トラブルシューティング

## 認証エラーが出る

```bash
# gh CLIの認証状態を確認
gh auth status

# 再認証
gh auth login
```

## バリデーションエラー

```bash
# 詳細なエラーを確認
labels-config validate labels.json

# よくある原因
# - ラベル名の重複
# - カラーコードに # が含まれている
# - 名前が長すぎる（50文字超）
```

## 同期されない

```bash
# verbose オプションで詳細確認
labels-config sync --owner user --repo repo --file labels.json --verbose

# dry-runで変更内容を確認
labels-config sync --owner user --repo repo --file labels.json --dry-run --verbose
```

## レート制限

```bash
# 現在のレート制限を確認
gh api rate_limit

# 制限に達した場合は60分待つ
```

# ライブラリとしての使用

Node.jsプロジェクト内でプログラマティックに使用することもできます：

```typescript
import { GitHubLabelSync } from '@asagiri-design/labels-config/github'
import { CONFIG_TEMPLATES } from '@asagiri-design/labels-config/config'

const sync = new GitHubLabelSync({
  owner: 'your-org',
  repo: 'your-repo'
})

// テンプレートを使用
const labels = CONFIG_TEMPLATES.minimal
await sync.syncLabels(labels)
```

インストール：

```bash
npm install @asagiri-design/labels-config
```

# まとめ

`@asagiri-design/labels-config` を使えば：

- **ラベル設定をコードで管理**できる
- **テンプレートから簡単に**始められる
- **ドライランで安全に**変更を確認できる
- **GitHub Actionsで自動化**できる
- **複数リポジトリに一括同期**できる

GitHub CLIの認証をそのまま使えるので、トークン管理の手間もありません。

ぜひチーム開発のラベル管理に活用してみてください！

---

## 関連リンク

- [npm: @asagiri-design/labels-config](https://www.npmjs.com/package/@asagiri-design/labels-config)
- [GitHub: BoxPistols/labels-config](https://github.com/BoxPistols/labels-config)
