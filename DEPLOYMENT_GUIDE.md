# デプロイメント完全ガイド

本プロジェクト `@boxpistols/labels-config` を GitHub と npm に公開するための完全な手順です。

## 前提条件チェックリスト

- [ ] GitHub アカウント (@BoxPistols) にログイン
- [ ] npm アカウント作成済み
- [ ] Node.js 18+ インストール済み
- [ ] git インストール済み
- [ ] GitHub personal access token (PAT) 取得可能

## Phase 1: ローカル環境準備

### 1.1 プロジェクトのコピー

```bash
# プロジェクトをホームディレクトリにコピー
cp -r /tmp/labels-config ~/labels-config
cd ~/labels-config

# 既存の git 履歴を確認
git log --oneline
```

### 1.2 依存関係のインストール

```bash
npm install
```

### 1.3 ローカルテスト

```bash
# タイプチェック
npm run type-check

# リント確認
npm run lint

# テスト実行
npm test

# ビルド確認
npm run build
```

すべてが成功したら、GitHub へ進みます。

## Phase 2: GitHub リポジトリ作成

### 2.1 新しいリポジトリを作成

1. https://github.com/new にアクセス
2. Repository name: `labels-config`
3. Description: `Comprehensive label management system for GitHub repositories and development teams`
4. Visibility: **Public** を選択
5. **Initialize this repository with:** は何も選択しない
6. Create repository をクリック

### 2.2 ローカルリポジトリをリモートに接続

```bash
cd ~/labels-config

# 現在のブランチ状態を確認
git branch

# master から main に変更
git branch -m master main

# リモートを追加
git remote add origin https://github.com/BoxPistols/labels-config.git

# リモートを確認
git remote -v

# main ブランチをプッシュ
git push -u origin main
```

**結果**: リポジトリが GitHub に反映されます。

## Phase 3: npm への公開準備

### 3.1 npm にログイン

```bash
npm login
```

プロンプトに従って：
- Username: npm アカウントのユーザー名
- Password: npm アカウントのパスワード
- Email: 登録済みメールアドレス

成功メッセージ：
```
Logged in as your-npm-username on https://registry.npmjs.org/.
```

### 3.2 パッケージ名の確認

```bash
# package.json を確認
cat package.json | grep '"name"'

# 出力: "name": "@boxpistols/labels-config"
```

### 3.3 npm に公開

```bash
# 初回公開（public アクセス）
npm publish --access public
```

**成功メッセージ例：**
```
npm notice
npm notice 📦  @boxpistols/labels-config@0.1.0
npm notice === Tarball Contents ===
npm notice ...
npm notice === Tarball Details ===
npm notice name:          @boxpistols/labels-config
npm notice version:       0.1.0
npm notice ...
```

### 3.4 npm に公開されたことを確認

```bash
# オンラインで確認
npm view @boxpistols/labels-config

# または以下のURL にアクセス
# https://www.npmjs.com/package/@boxpistols/labels-config
```

## Phase 4: GitHub Actions 自動公開の設定

### 4.1 npm token を生成

1. https://www.npmjs.com/settings/your-username/tokens にアクセス
2. Generate New Token をクリック
3. **Automation** を選択
4. トークンをコピー
5. 安全な場所に保管

### 4.2 GitHub Secrets にトークンを設定

1. GitHub リポジトリに移動
2. Settings タブをクリック
3. Secrets and variables > Actions をクリック
4. New repository secret をクリック
5. Name: `NPM_TOKEN`
6. Secret: npm token をペースト
7. Add secret をクリック

**確認：**
```bash
# GitHub リポジトリで確認
Settings > Secrets and variables > Actions
→ NPM_TOKEN が表示される
```

### 4.3 GitHub Actions ワークフローを確認

```bash
# GitHub Actions パイプラインを確認
# Repository > Actions
# 以下が表示されるはず：
# - Test (push/PR時に実行)
# - Publish (Release作成時に実行)
```

## Phase 5: Release と自動公開

### 5.1 GitHub Release を作成

1. GitHub リポジトリに移動
2. Releases セクションに移動
3. Draft a new release をクリック
4. Tag version: `v0.1.0`
5. Release title: `Release v0.1.0`
6. Description: （オプション）
   ```
   ## Features
   - Label validation and management
   - GitHub API integration (using gh CLI)
   - CLI tool
   - Multiple templates (minimal, github, prod, prod-en, prod-ja, react, vue, frontend, agile)
   - Full TypeScript support
   - CDN distribution
   ```
7. Publish release をクリック

### 5.2 自動公開を確認

1. GitHub Actions を確認
   - Publish workflow が実行される
2. npm registry を確認
   - https://www.npmjs.com/package/@boxpistols/labels-config
   - Version 0.1.0 が表示される

## Phase 6: CDN での利用確認

### 6.1 jsDelivr CDN での利用

```html
<!-- UMD ビルド -->
<script src="https://cdn.jsdelivr.net/npm/@boxpistols/labels-config@0.1.0/dist/index.umd.js"></script>

<!-- 最新バージョン -->
<script src="https://cdn.jsdelivr.net/npm/@boxpistols/labels-config@latest/dist/index.umd.js"></script>

<!-- ESM -->
<script type="module">
  import * from 'https://cdn.jsdelivr.net/npm/@boxpistols/labels-config@latest/dist/index.esm.js'
</script>
```

### 6.2 unpkg CDN での利用

```html
<script src="https://unpkg.com/@boxpistols/labels-config@0.1.0/dist/index.umd.js"></script>
```

## Phase 7: パッケージのインストール検証

### 7.1 新規プロジェクトでテスト

```bash
# 一時ディレクトリで新規プロジェクトを作成
mkdir test-labels-config
cd test-labels-config

# npm から直接インストール
npm init -y
npm install @boxpistols/labels-config

# TypeScript で利用
cat > test.ts << 'EOF'
import { LabelManager } from '@boxpistols/labels-config'

const manager = new LabelManager()
manager.addLabel({
  name: 'test',
  color: '000000',
  description: 'Test label'
})

console.log(manager.getAllLabels())
EOF

# テスト実行
npx ts-node test.ts
```

## Phase 8: GitHub ページの設定（オプション）

ドキュメント を GitHub Pages で公開する場合：

### 8.1 GitHub Pages を有効化

1. Settings > Pages
2. Build and deployment
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /docs
3. Save

### 8.2 README.md にバッジを追加

```markdown
# @boxpistols/labels-config

[![npm version](https://badge.fury.io/js/%40boxpistols%2Flabels-config.svg)](https://www.npmjs.com/package/@boxpistols/labels-config)
[![Build Status](https://github.com/BoxPistols/labels-config/workflows/Test/badge.svg)](https://github.com/BoxPistols/labels-config/actions?query=workflow%3ATest)
[![npm downloads](https://img.shields.io/npm/dm/@boxpistols/labels-config.svg)](https://www.npmjs.com/package/@boxpistols/labels-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## Phase 9: バージョン管理とアップデート

### 9.1 バージョンをアップデート

```bash
cd ~/labels-config

# パッチバージョン (0.1.0 → 0.1.1)
npm version patch

# マイナーバージョン (0.1.0 → 0.2.0)
npm version minor

# メジャーバージョン (0.1.0 → 1.0.0)
npm version major
```

### 9.2 GitHub にプッシュ

```bash
git push origin main
git push origin --tags
```

### 9.3 GitHub から Release を作成

GitHub UI から Release を作成すると、Publish workflow が自動実行され npm に公開されます。

## トラブルシューティング

### npm publish エラー

**エラー: "You do not have permission to publish"**
- npm が正しくログインしているか確認：`npm whoami`
- パッケージ名が既に存在していないか確認

**エラー: "EACCES: permission denied"**
- npm キャッシュをクリア：`npm cache clean --force`
- 再度ログイン：`npm login`

### GitHub Actions エラー

**Publish workflow が失敗**
- Settings > Secrets and variables > Actions で NPM_TOKEN を確認
- トークンが有効期限切れでないか確認

**Test workflow が失敗**
- ローカルで `npm test` が成功しているか確認
- Node.js バージョンを確認：18.x or 20.x

### Git エラー

**リモートを追加できない**
```bash
# 既存のリモートを削除
git remote remove origin

# 再度追加
git remote add origin https://github.com/BoxPistols/labels-config.git
```

## セキュリティチェックリスト

公開前に必ず確認してください：

- [ ] `.env.local` ファイルがない
- [ ] npm token がコミットされていない
- [ ] GitHub token がコミットされていない
- [ ] 機密情報が README や docs にない
- [ ] package.json の repository URL が正しい
- [ ] LICENSE ファイルが含まれている
- [ ] .gitignore が適切に設定されている
- [ ] 個人ユーザー名が含まれていない

## チェックリスト（完了後）

- [ ] GitHub リポジトリが public
- [ ] npm パッケージが公開済み
- [ ] GitHub Actions workflows が成功
- [ ] CDN で利用可能
- [ ] npm docs が表示される
- [ ] GitHub Pages が動作（オプション）
- [ ] バッジが表示される

## 参考リンク

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/publishing-a-package)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [jsDelivr CDN](https://www.jsdelivr.com/)
- [unpkg CDN](https://unpkg.com/)

---

すべての Phase が完了すると、@boxpistols/labels-config は npm registry と CDN で公式に利用可能になります。
