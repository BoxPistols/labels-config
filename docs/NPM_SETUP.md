# npm Trusted Publishers (OIDC) セットアップガイド

このプロジェクトは、npm の **Trusted Publishers (OIDC)** 方式を使用して自動的にパッケージを公開しています。
従来の長期有効なトークンではなく、GitHub Actions が実行時に一時的な認証情報を取得する方式です。

## 🔐 セキュリティ強化について

### npm の新しいセキュリティポリシー（2024年〜）

- **長期トークンの有効期限短縮**: 書き込み可能なトークンはデフォルト7日、最大90日に制限
- **クラシックトークンの廃止**: 従来の広範な権限を持つトークンは段階的に廃止
- **TOTP から WebAuthn/パスキーへの移行**: より強力な2要素認証への移行を推奨
- **Trusted Publishers の推奨**: CI/CD での OIDC 認証方式を標準に

### Trusted Publishers (OIDC) のメリット

✅ **トークン管理不要**: 手動でのトークン生成・更新・ローテーションが不要
✅ **セキュリティリスク最小化**: 長期有効なトークンが漏洩するリスクがゼロ
✅ **自動 Provenance**: パッケージの出所証明が自動的に生成される
✅ **最小権限の原則**: 各 CI/CD ジョブに必要最低限の権限のみ付与
✅ **npm の推奨方式**: 今後の標準として推奨されている方式

## 📋 必須：npm での Trusted Publisher 設定

このリポジトリのワークフローが正常に動作するためには、npm 側で Trusted Publisher の設定が必要です。

### ステップ 1: npm にログイン

1. [npmjs.com](https://www.npmjs.com/) にアクセス
2. あなたのアカウントでログイン

### ステップ 2: パッケージの設定画面へ移動

1. パッケージ `@boxpistols/labels-config` のページへ移動
2. "Settings" タブをクリック

### ステップ 3: Publishing Access の設定

1. 左サイドバーから **"Publishing Access"** を選択
2. **"Add Trusted Publisher"** または **"Configure OIDC"** をクリック

### ステップ 4: GitHub Actions の情報を入力

以下の情報を入力します：

| 項目 | 値 |
|------|-----|
| **Provider** | GitHub |
| **Organization / Repository owner** | `BoxPistols` |
| **Repository name** | `labels-config` |
| **Workflow name** | （以下の3つを個別に追加） |

**追加するワークフロー:**

1. **自動リリース用**（main へのマージ時）
   - Workflow: `auto-release.yml`
   - Environment: （空欄のまま）
   - Job: `auto-patch-release`

2. **手動リリース用**
   - Workflow: `manual-release.yml`
   - Environment: （空欄のまま）
   - Job: `manual-release`

3. **GitHub Release トリガー用**
   - Workflow: `publish.yml`
   - Environment: （空欄のまま）
   - Job: `publish`

### ステップ 5: 設定の保存

各ワークフローを追加後、設定を保存します。

## 🚀 動作確認

### main ブランチへのマージで自動公開

```bash
# feature ブランチで作業
git checkout -b feature/new-feature
# コードを変更
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# PR を作成してマージ
# → main へのマージ後、自動的にパッチバージョンがリリースされ npm に公開される
```

### 手動でのバージョン指定リリース

GitHub の Actions タブから "Manual Release" ワークフローを実行：

1. リポジトリの **Actions** タブを開く
2. **"Manual Release"** を選択
3. **"Run workflow"** をクリック
4. バージョンタイプを選択（patch / minor / major / prerelease）
5. **"Run workflow"** を実行

## 🔍 トラブルシューティング

### エラー: "403 Forbidden" または "OIDC authentication failed"

**原因**: npm で Trusted Publisher が正しく設定されていない

**解決方法**:
1. npm の Publishing Access 設定を再確認
2. Organization、Repository、Workflow、Job 名が正確に一致しているか確認
3. 設定後、数分待ってから再試行

### エラー: "Provenance generation failed"

**原因**: ワークフローの permissions 設定が不足している

**解決方法**:
- ワークフローファイルに以下が含まれているか確認：
  ```yaml
  permissions:
    contents: write  # または read（ジョブに応じて）
    id-token: write  # OIDC に必須
  ```

### リリースがスキップされる

**原因**: コミットメッセージに `[skip ci]` または `[no release]` が含まれている

**解決方法**:
- これらのキーワードを含まないコミットメッセージを使用
- または、手動リリースワークフローを使用

## 📚 参考リンク

- [npm: Publishing packages with provenance via GitHub Actions](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub: Security hardening with OpenID Connect](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [npm Blog: Introducing npm package provenance](https://github.blog/2023-04-19-introducing-npm-package-provenance/)

## 🔄 従来のトークン方式からの移行

もし以前 `NPM_TOKEN` シークレットを使用していた場合：

1. ✅ Trusted Publisher の設定を完了
2. ✅ ワークフローが正常に動作することを確認
3. ✅ GitHub リポジトリの Settings → Secrets から `NPM_TOKEN` を削除（もう不要です）

## 💡 ベストプラクティス

### コミットメッセージ

自動リリースをスキップしたい場合は、コミットメッセージに `[skip ci]` または `[no release]` を含めます：

```bash
git commit -m "docs: update README [skip ci]"
git commit -m "chore: update dependencies [no release]"
```

### バージョニング戦略

- **patch**: バグ修正、小さな改善（main へのマージで自動）
- **minor**: 新機能追加（手動リリース推奨）
- **major**: 破壊的変更（手動リリース推奨）
- **prerelease**: ベータ版リリース（手動リリース）

### 2要素認証の強化

npm アカウントのセキュリティ強化のため、WebAuthn/パスキーの使用を推奨：

1. npm アカウント設定で 2FA を開く
2. パスキー（YubiKey、Touch ID、Face ID など）を追加
3. 従来の TOTP（Google Authenticator など）からの移行を検討

---

**設定完了後、このリポジトリは自動的に npm への公開が可能になります 🎉**
