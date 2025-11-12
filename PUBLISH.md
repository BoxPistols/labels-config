# npm Package 公開・更新手順

## 初回セットアップ

### 1. npm アカウント作成
```bash
# npm にアカウントがない場合
https://www.npmjs.com/signup

# npm にログイン
npm login
```

### 2. パッケージ名の確認
`package.json` の `name` フィールドを確認:
```json
{
  "name": "labels-config-boxpistols"
}
```

---

## 公開前の準備

### 1. コードの変更を確認
```bash
git status
git diff
```

### 2. ビルド
```bash
npm run build
```

### 3. バージョン確認
現在のバージョン: `0.1.0`

---

## バージョン更新方法

### パッチバージョン（バグ修正: 0.1.0 → 0.1.1）
```bash
npm version patch
```

### マイナーバージョン（機能追加: 0.1.0 → 0.2.0）
```bash
npm version minor
```

### メジャーバージョン（破壊的変更: 0.1.0 → 1.0.0）
```bash
npm version major
```

**`npm version` コマンドは自動的に:**
- package.json のバージョンを更新
- git commit を作成
- git tag を作成

---

## npm に公開

### 1. ドライラン（実際には公開しない）
```bash
npm publish --dry-run
```

出力を確認して、公開されるファイルが正しいか確認。

### 2. 本番公開
```bash
npm publish
```

### 3. スコープ付きパッケージの場合（初回のみ）
```bash
npm publish --access public
```

---

## 公開後の確認

### 1. npm レジストリで確認
```bash
# パッケージ情報を表示
npm info labels-config-boxpistols

# 最新バージョンを確認
npm view labels-config-boxpistols version
```

### 2. Web で確認
https://www.npmjs.com/package/labels-config-boxpistols

### 3. インストールテスト
```bash
# 別のディレクトリでテスト
mkdir test-install && cd test-install
npm install labels-config-boxpistols
labels-config help
```

---

## 完全な更新フロー（推奨）

```bash
# 1. 最新のコードをプル
git pull origin main

# 2. 依存関係を更新
npm install

# 3. ビルド
npm run build

# 4. テスト（もしあれば）
npm test

# 5. バージョンを更新
npm version patch  # または minor/major

# 6. ドライランで確認
npm publish --dry-run

# 7. 公開
npm publish

# 8. Git にプッシュ（タグも含む）
git push && git push --tags
```

---

## トラブルシューティング

### "You must be logged in to publish packages"
```bash
npm login
# ユーザー名、パスワード、メールアドレスを入力
```

### "You do not have permission to publish"
```bash
# パッケージ名が既に使用されている場合
# package.json の name を変更
```

### "Cannot publish over previously published version"
```bash
# バージョンを更新
npm version patch
```

### ビルドファイルが含まれていない
```bash
# package.json の files フィールドを確認
{
  "files": [
    "dist",
    "templates"
  ]
}
```

---

## 自動化（GitHub Actions）

### .github/workflows/publish.yml を作成

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**NPM_TOKEN の設定:**
1. https://www.npmjs.com/settings/your-username/tokens で Access Token を作成
2. GitHub リポジトリの Settings → Secrets → Actions → New repository secret
3. Name: `NPM_TOKEN`, Value: 作成したトークン

---

## クイックリファレンス

| コマンド | 説明 |
|---------|------|
| `npm login` | npm にログイン |
| `npm whoami` | ログイン中のユーザーを確認 |
| `npm version patch` | パッチバージョンを上げる (0.1.0 → 0.1.1) |
| `npm version minor` | マイナーバージョンを上げる (0.1.0 → 0.2.0) |
| `npm version major` | メジャーバージョンを上げる (0.1.0 → 1.0.0) |
| `npm publish --dry-run` | 公開のドライラン |
| `npm publish` | npm に公開 |
| `npm unpublish <package>@<version>` | バージョンを削除（24時間以内のみ） |

---

## セマンティックバージョニング

- **MAJOR**: 破壊的変更（API の変更など）
- **MINOR**: 機能追加（後方互換性あり）
- **PATCH**: バグ修正（後方互換性あり）

例:
- `0.1.0` → `0.1.1` : バグ修正
- `0.1.0` → `0.2.0` : 新機能追加
- `0.1.0` → `1.0.0` : 破壊的変更

---

**現在のバージョン: 0.1.0**
