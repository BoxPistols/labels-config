# Setup Instructions for @boxpistols/labels-config

このドキュメントは、`labels-config` プロジェクトを GitHub にプッシュし、npm に公開するための手順を説明します。

## 前提条件

- Node.js 18+
- npm アカウント
- GitHub アカウント (@BoxPistols)
- GitHub personal access token

## ステップ 1: GitHub リポジトリの作成

1. GitHub にログイン
2. 「新規リポジトリを作成」をクリック
3. リポジトリ名: `labels-config`
4. 説明: `Comprehensive label management system for GitHub repositories`
5. Public として作成
6. README は作成しない（既に存在するため）

## ステップ 2: ローカルリポジトリの設定

```bash
cd /tmp/labels-config

# リモートを追加
git remote add origin https://github.com/BoxPistols/labels-config.git

# デフォルトブランチを main に変更
git branch -m master main

# GitHub にプッシュ
git push -u origin main
```

## ステップ 3: npm 公開の準備

### 3.1 npm アカウントにログイン

```bash
npm login
```

ユーザー名、パスワード、メールアドレスを入力してください。

### 3.2 パッケージ情報の確認

```bash
# package.json を確認
cat package.json

# 依存関係をインストール
npm install
```

### 3.3 ビルドとテスト

```bash
# タイプチェック
npm run type-check

# テスト実行
npm test

# ビルド
npm run build
```

### 3.4 npm に公開

```bash
# 初回公開
npm publish --access public
```

成功メッセージが表示されたら、パッケージが npm registry に公開されています。

https://www.npmjs.com/package/@boxpistols/labels-config

## ステップ 4: GitHub Actions シークレットの設定

npm への自動公開を有効にするには、GitHub リポジトリにシークレットを設定します。

1. GitHub リポジトリの Settings に移動
2. Secrets and variables > Actions をクリック
3. New repository secret をクリック
4. 名前: `NPM_TOKEN`
5. 値: npm authentication token（npm account settings から生成）
6. Add secret をクリック

### npm token の生成方法

1. https://www.npmjs.com/settings/your-username/tokens にアクセス
2. Generate New Token をクリック
3. Automation を選択
4. トークンをコピーして GitHub にペースト

## ステップ 5: CDN 配信の設定

### jsDelivr CDN

パッケージは自動的に jsDelivr に公開されます：

```html
<!-- UMD Build -->
<script src="https://cdn.jsdelivr.net/npm/@boxpistols/labels-config@latest/dist/index.umd.js"></script>

<!-- ESM -->
<script type="module">
  import * from 'https://cdn.jsdelivr.net/npm/@boxpistols/labels-config@latest/dist/index.esm.js'
</script>
```

### unpkg CDN

```html
<script src="https://unpkg.com/@boxpistols/labels-config@latest/dist/index.umd.js"></script>
```

## ステップ 6: リリースの作成

GitHub から自動公開を有効にするには：

1. リポジトリで Releases セクションに移動
2. Create a new release をクリック
3. タグを作成: `v0.1.0`
4. タイトル: Release v0.1.0
5. GitHub Actions publish workflow が実行される
6. npm に自動的に公開される

## ステップ 7: ドキュメントのセットアップ

### 7.1 GitHub Pages の有効化（オプション）

```bash
# docs フォルダを公開
# Settings > Pages > Source: Deploy from a branch > main > /docs
```

### 7.2 README のバッジ追加

```markdown
[![npm version](https://badge.fury.io/js/%40boxpistols%2Flabels-config.svg)](https://badge.fury.io/js/%40boxpistols%2Flabels-config)
[![Build Status](https://github.com/BoxPistols/labels-config/workflows/Test/badge.svg)](https://github.com/BoxPistols/labels-config/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## バージョン管理

バージョンアップ時の手順：

```bash
# 1. バージョンを更新
npm version minor  # または patch, major

# 2. タグが作成される
git push origin main
git push origin tags

# 3. GitHub から release を作成
#    または Release workflow が自動実行される
```

## トラブルシューティング

### npm publish がアクセス拒否される

```bash
# ログイン状態を確認
npm whoami

# ログアウトして再度ログイン
npm logout
npm login
```

### GitHub Actions が失敗する

```bash
# Actions logs を確認
# Repository > Actions > Failed workflow > Logs
```

### 型定義が見つからない

```bash
# ビルドを確認
npm run build

# dist フォルダが生成されていることを確認
ls -la dist/
```

## セキュリティ

### npm token の安全性

- GitHub シークレットは暗号化されます
- ローカルで token を commit しないでください
- `.npmrc` をリポジトリにコミットしないでください

### パッケージスコープ

スコープ付きパッケージは認証なしで公開・インストール可能です（public の場合）。

## 参考リンク

- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/publishing-a-package)
- [GitHub Actions for npm](https://github.com/marketplace/actions/publish-to-npm)
- [jsDelivr CDN](https://www.jsdelivr.com/)

## 次のステップ

1. 本番用に README を更新
2. CHANGELOG.md を作成
3. コントリビューション ガイドラインを更新
4. GitHub Releases でバージョン履歴を管理
5. npm package home page（npmjs.com）を更新
