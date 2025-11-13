# Publishing Guide

このパッケージには3つのリリース方法があります。

---

## 方法1: ローカルから手動リリース（即座に使える）

### 前提条件

npm に認証済みであること：
```bash
npm login
```

### リリースコマンド

```bash
# パッチリリース (0.2.0 → 0.2.1)
npm run release:patch

# マイナーリリース (0.2.0 → 0.3.0)
npm run release:minor

# メジャーリリース (0.2.0 → 1.0.0)
npm run release:major

# ベータリリース (0.2.0 → 0.2.1-beta.0)
npm run release:beta
```

### 実行内容

各コマンドは以下を自動実行します：

1. バージョン番号を更新（package.json と src/version.ts）
2. コミット作成（"Release vX.X.X"）
3. Git タグ作成
4. ビルド実行
5. npm に公開
6. Git にプッシュ（タグ含む）

**注意:** コミットメッセージに `[skip ci]` を含めて無限ループを防止

---

## 方法2: GitHub Actions で自動リリース（推奨）

### 設定

`.github/workflows/auto-release.yml` が設定済み。

### トリガー条件

`main` ブランチに以下のファイルが変更されたプッシュ時：
- `src/**`
- `package.json`

### 自動的に実行される内容

1. テスト実行
2. パッチバージョンを自動アップ（0.2.0 → 0.2.1）
3. ビルド
4. npm に公開
5. Git にプッシュ

### リリースをスキップしたい場合

コミットメッセージに以下を含める：

```bash
git commit -m "fix: something [skip ci]"
# または
git commit -m "docs: update [no release]"
```

### 必要な Secrets

GitHub Settings → Secrets → Actions で設定：

- `NPM_TOKEN`: npm アクセストークン
  - https://www.npmjs.com/settings/YOUR_USERNAME/tokens
  - "Automation" トークンを作成

---

## 方法3: GitHub UI から手動リリース

### 設定

`.github/workflows/manual-release.yml` が設定済み。

### 使い方

1. GitHub リポジトリページで `Actions` タブを開く
2. 左サイドバーから `Manual Release` を選択
3. `Run workflow` をクリック
4. バージョンタイプを選択：
   - **patch**: バグ修正（0.2.0 → 0.2.1）
   - **minor**: 新機能（0.2.0 → 0.3.0）
   - **major**: 破壊的変更（0.2.0 → 1.0.0）
   - **prerelease**: ベータ版（0.2.0 → 0.2.1-beta.0）
5. `Run workflow` を実行

### 実行内容

1. テスト実行
2. 選択したバージョンタイプでバージョンアップ
3. ビルド
4. npm に公開（prerelease は `--tag beta`）
5. Git にプッシュ
6. GitHub Release を自動作成

---

## バージョニング戦略

### Semantic Versioning (semver) に従う

\`\`\`
MAJOR.MINOR.PATCH

例: 0.2.0
     │ │ └─ パッチ: バグ修正
     │ └─── マイナー: 後方互換性のある新機能
     └───── メジャー: 破壊的変更
\`\`\`

### いつ何を使うか

| 変更内容 | バージョン | コマンド |
|---------|-----------|---------|
| バグ修正 | patch | \`npm run release:patch\` |
| 新機能（後方互換） | minor | \`npm run release:minor\` |
| 破壊的変更 | major | \`npm run release:major\` |
| テスト版 | prerelease | \`npm run release:beta\` |

---

## トラブルシューティング

### npm publish が 403 エラー

\`\`\`bash
# ログイン状態を確認
npm whoami

# 再ログイン
npm login

# スコープパッケージの権限確認
npm access list packages @boxpistols
\`\`\`

### Git push が失敗

\`\`\`bash
# リモートの状態を確認
git fetch origin
git status

# リモートより遅れている場合
git pull --rebase
npm run release:patch
\`\`\`

### CI/CD でリリースが失敗

1. GitHub Secrets に \`NPM_TOKEN\` が設定されているか確認
2. npm トークンが有効期限切れでないか確認
3. Actions のログでエラー内容を確認

---

## 推奨ワークフロー

### 開発フロー

\`\`\`bash
# 1. 機能ブランチで開発
git checkout -b feature/new-feature

# 2. 変更をコミット
git commit -m "feat: add new feature"

# 3. main にマージ
git checkout main
git merge feature/new-feature

# 4. main にプッシュ（自動リリースが動く）
git push origin main
\`\`\`

### 手動リリースが必要な場合

\`\`\`bash
# メジャーバージョンアップなど、慎重に行いたい場合
npm run release:major

# または GitHub UI から Manual Release を実行
\`\`\`

---

## チェックリスト

リリース前に確認：

- [ ] CHANGELOG.md を更新（該当する場合）
- [ ] README の例が最新バージョンに対応
- [ ] ビルドが成功する（\`npm run build\`）
- [ ] テストが通る（\`npm test\`）
- [ ] 型チェックが通る（\`npm run type-check\`）
- [ ] ドキュメントが更新されている

---

## 参考リンク

- [npm Semantic Versioning](https://docs.npmjs.com/about-semantic-versioning)
- [npm version コマンド](https://docs.npmjs.com/cli/v9/commands/npm-version)
- [GitHub Actions ドキュメント](https://docs.github.com/en/actions)
