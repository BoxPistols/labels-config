# Quick Start - 3ステップで始めるラベル管理

`@asagiri-design/labels-config` を使って、GitHubリポジトリのラベルを簡単に管理できます。

---

## 🚀 3ステップで完了

### ステップ1: インストール（1回だけ）

```bash
npm install -g @asagiri-design/labels-config
```

### ステップ2: GitHub認証（1回だけ）

```bash
gh auth login
```

### ステップ3: ラベルを適用

```bash
# あなたのリポジトリにラベルを適用
labels-config batch-sync --repos YourName/YourRepo --template prod-ja
```

**これだけ！** 🎉

---

## 📋 具体例

### 例1: 自分のリポジトリ1つに適用

```bash
# Foo/Bar リポジトリに prod-ja テンプレートを適用
labels-config batch-sync --repos Foo/Bar --template prod-ja
```

**実行結果:**
```
📋 Target repositories: 1

✅ [1/1] Foo/Bar

📊 Batch Sync Summary:
✅ Successful: 1
```

---

### 例2: 自分の全リポジトリに一括適用

```bash
# あなたの全リポジトリに適用
labels-config batch-sync --user Foo --template prod-ja
```

---

### 例3: 組織の全リポジトリに一括適用

```bash
# Foo組織の全リポジトリに適用
labels-config batch-sync --org Foo --template prod-ja
```

---

### 例4: 複数のリポジトリを指定

```bash
# 複数のリポジトリに一括適用
labels-config batch-sync \
  --repos Foo/Bar,Foo/Baz,Foo/Qux \
  --template prod-ja
```

---

## 🔍 ドライランで事前確認

実際に変更する前に、何が変更されるか確認できます：

```bash
# ドライラン（変更を実行しない）
labels-config batch-sync --repos Foo/Bar --template prod-ja --dry-run
```

**出力例:**
```
[DRY RUN] 📋 Target repositories: 1

📊 Batch Sync Configuration
Labels: 14
Repositories: 1 specified
Parallel: 3
Mode: append

✅ [1/1] Foo/Bar

📊 Batch Sync Summary:
✅ Successful: 1
```

問題なければ `--dry-run` を外して本番実行してください。

---

## 🎨 利用可能なテンプレート

| テンプレート名 | 説明 | ラベル数 |
|--------------|------|---------|
| `minimal` | 基本的な3ラベル (bug, feature, documentation) | 3 |
| `github` | GitHub標準ラベル | 9 |
| `prod-ja` | 本番プロジェクト用（日本語） | 14 |
| `prod-en` | 本番プロジェクト用（英語） | 14 |
| `react` | React開発用 | 12 |
| `vue` | Vue.js開発用 | 12 |
| `frontend` | フロントエンド開発用 | 15 |
| `agile` | アジャイル/スクラム用 | 18 |

### テンプレートの内容を確認

```bash
# テンプレートからファイル生成
labels-config init prod-ja --file labels.json

# ファイルを確認
cat labels.json
```

---

## 🎯 よくある使い方

### パターン1: 新しいリポジトリを作ったらすぐ実行

```bash
# 1. 新しいリポジトリを作成
gh repo create Foo/NewProject --public

# 2. ラベルを適用
labels-config batch-sync --repos Foo/NewProject --template prod-ja
```

---

### パターン2: 既存リポジトリのラベルを統一

```bash
# 組織の全リポジトリのラベルを統一
labels-config batch-sync --org Foo --template prod-ja
```

---

### パターン3: TypeScriptプロジェクトだけに適用

```bash
# TypeScriptプロジェクトのみフィルタリング
labels-config batch-sync \
  --org Foo \
  --template react \
  --filter-lang TypeScript
```

---

### パターン4: 公開リポジトリのみに適用

```bash
# 公開リポジトリのみに適用
labels-config batch-sync \
  --user Foo \
  --template prod-ja \
  --filter-vis public
```

---

## 🔄 2つのモード

### Appendモード（デフォルト）

既存のラベルを保持したまま、新しいラベルを追加・更新します。

```bash
labels-config batch-sync --repos Foo/Bar --template prod-ja
```

**動作:**
- ✅ 新しいラベルを追加
- ✅ 既存のラベルを更新
- ✅ 設定にないラベルは保持

---

### Replaceモード

既存のラベルを完全に置き換えます。

```bash
labels-config batch-sync --repos Foo/Bar --template prod-ja --delete-extra
```

**動作:**
- ✅ 新しいラベルを追加
- ✅ 既存のラベルを更新
- ❌ 設定にないラベルを削除

---

## ⚙️ オプション一覧

### ターゲット指定（いずれか必須）

| オプション | 説明 | 例 |
|-----------|------|-----|
| `--repos <list>` | リポジトリリスト（カンマ区切り） | `--repos Foo/Bar,Foo/Baz` |
| `--user <name>` | ユーザーの全リポジトリ | `--user Foo` |
| `--org <name>` | 組織の全リポジトリ | `--org Foo` |

### ラベル指定（いずれか必須）

| オプション | 説明 | 例 |
|-----------|------|-----|
| `--template <name>` | テンプレート名 | `--template prod-ja` |
| `--file <path>` | カスタムラベルファイル | `--file ./labels.json` |

### フィルタリング（オプション）

| オプション | 説明 | 例 |
|-----------|------|-----|
| `--filter-lang <lang>` | プログラミング言語でフィルタ | `--filter-lang TypeScript` |
| `--filter-vis <vis>` | 可視性でフィルタ (public/private/all) | `--filter-vis public` |

### その他（オプション）

| オプション | 説明 | 例 |
|-----------|------|-----|
| `--dry-run` | ドライラン（実行しない） | `--dry-run` |
| `--delete-extra` | Replaceモード（設定外を削除） | `--delete-extra` |
| `--parallel <num>` | 並列実行数（デフォルト: 3） | `--parallel 5` |

---

## 🔐 必要な権限

### 1. GitHub CLI の認証

```bash
gh auth login
```

以下のスコープが必要です：
- `repo` (リポジトリへのアクセス)

### 2. リポジトリへのアクセス権限

対象リポジトリへの **管理者権限** または **書き込み権限** が必要です。

**確認方法:**
```bash
# リポジトリのアクセス権限を確認
gh repo view Foo/Bar --json permissions
```

---

## 📚 次のステップ

### カスタムラベルを作成

```bash
# 1. テンプレートからファイル生成
labels-config init prod-ja --file my-labels.json

# 2. ファイルを編集
vim my-labels.json

# 3. 適用
labels-config batch-sync --repos Foo/Bar --file my-labels.json
```

### 複雑な設定を使う

複数の条件で異なるテンプレートを適用する場合は、設定ファイルを使用：

```bash
# 設定ファイルを作成
cat > batch-config.json << EOF
{
  "version": "1.0.0",
  "targets": [
    {
      "organization": "Foo",
      "filter": { "language": "TypeScript" },
      "template": "react"
    },
    {
      "repositories": ["Foo/special-project"],
      "file": "./special-labels.json"
    }
  ]
}
EOF

# 設定ファイルで実行
labels-config batch-config batch-config.json
```

詳細は [BATCH_SYNC.md](./BATCH_SYNC.md) を参照してください。

---

## ❓ トラブルシューティング

### エラー: `command not found: labels-config`

**原因:** パッケージがインストールされていない

**解決方法:**
```bash
npm install -g @asagiri-design/labels-config
```

---

### エラー: `gh: command not found`

**原因:** GitHub CLI がインストールされていない

**解決方法:**
```bash
# macOS
brew install gh

# Windows
winget install --id GitHub.cli

# Linux
# https://github.com/cli/cli#installation
```

---

### エラー: `Permission denied`

**原因:** リポジトリへのアクセス権限がない

**解決方法:**
1. リポジトリの設定で自分の権限を確認
2. `gh auth status` で認証状態を確認
3. `gh auth refresh` で認証を更新

---

### エラー: `API rate limit exceeded`

**原因:** GitHub APIのレート制限に達した

**解決方法:**
```bash
# 並列数を減らす
labels-config batch-sync --user Foo --template prod-ja --parallel 1

# または時間を置いて再実行
```

---

## 🆘 ヘルプ

```bash
# ヘルプを表示
labels-config help

# コマンドの使い方を確認
labels-config batch-sync --help
```

---

## 📖 関連ドキュメント

- [Getting Started](./GETTING_STARTED.md) - 詳細な使い方
- [Batch Sync](./BATCH_SYNC.md) - バッチ同期の詳細
- [API Documentation](./API.md) - プログラマティックな使い方
- [GitHub Repository](https://github.com/your-org/labels-config) - ソースコード

---

## 💡 Tips

### Tip 1: エイリアスを作成

```bash
# .bashrc または .zshrc に追加
alias label-sync='labels-config batch-sync'

# 使用例
label-sync --repos Foo/Bar --template prod-ja
```

### Tip 2: プロジェクトごとの設定ファイル

```bash
# プロジェクトディレクトリに設定ファイルを作成
cat > .labelrc.json << EOF
{
  "version": "1.0.0",
  "targets": [
    {
      "repositories": ["$(gh repo view --json nameWithOwner -q .nameWithOwner)"],
      "template": "prod-ja"
    }
  ]
}
EOF

# いつでも簡単に実行
labels-config batch-config .labelrc.json
```

### Tip 3: GitHub Actionsで自動化

新しいリポジトリ作成時に自動でラベルを適用：

```yaml
# .github/workflows/auto-label.yml
name: Auto Apply Labels
on:
  repository_dispatch:
    types: [repository-created]

jobs:
  apply-labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
      - run: npm install -g @asagiri-design/labels-config
      - run: labels-config batch-sync \
             --repos ${{ github.repository }} \
             --template prod-ja
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

**さあ、始めましょう！** 🚀

```bash
labels-config batch-sync --repos YourName/YourRepo --template prod-ja
```
