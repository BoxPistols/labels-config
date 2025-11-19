# Batch Sync - 複数リポジトリ一括ラベル管理

`labels-config` の Batch Sync 機能を使用すると、複数のGitHubリポジトリに対して一括でラベルを同期できます。

## 主要機能

### 1. コマンドラインからの一括同期 (`batch-sync`)

複数のリポジトリに対して、コマンドラインから直接ラベルを同期できます。

#### 組織全体のリポジトリに同期

```bash
# 組織の全リポジトリにテンプレートを適用
labels-config batch-sync --org BoxPistols --template prod-ja

# ドライランで確認
labels-config batch-sync --org BoxPistols --template prod-ja --dry-run

# 特定の言語でフィルタリング
labels-config batch-sync --org BoxPistols --template react --filter-lang TypeScript

# 公開リポジトリのみに適用
labels-config batch-sync --org BoxPistols --template prod-ja --filter-vis public
```

#### ユーザーの全リポジトリに同期

```bash
# ユーザーの全リポジトリに同期
labels-config batch-sync --user BoxPistols --template prod-ja

# プライベートリポジトリのみ
labels-config batch-sync --user BoxPistols --template prod-ja --filter-vis private
```

#### 特定のリポジトリリストに同期

```bash
# カスタムラベルファイルを使用
labels-config batch-sync \
  --repos BoxPistols/repo1,BoxPistols/repo2,BoxPistols/repo3 \
  --file ./custom-labels.json

# テンプレートを使用
labels-config batch-sync \
  --repos BoxPistols/repo1,BoxPistols/repo2 \
  --template prod-ja
```

#### オプション

| オプション | 説明 | 例 |
|-----------|------|-----|
| `--org <name>` | 組織名 | `--org BoxPistols` |
| `--user <name>` | ユーザー名 | `--user BoxPistols` |
| `--repos <list>` | リポジトリリスト（カンマ区切り） | `--repos owner/repo1,owner/repo2` |
| `--template <name>` | テンプレート名 | `--template prod-ja` |
| `--file <path>` | カスタムラベルファイル | `--file ./labels.json` |
| `--filter-lang <lang>` | プログラミング言語でフィルタ | `--filter-lang TypeScript` |
| `--filter-vis <vis>` | 可視性でフィルタ | `--filter-vis public` |
| `--parallel <num>` | 並列実行数（デフォルト: 3） | `--parallel 5` |
| `--dry-run` | ドライラン（実際には変更しない） | `--dry-run` |
| `--delete-extra` | 設定にないラベルを削除（Replace モード） | `--delete-extra` |

---

### 2. 設定ファイルからの一括同期 (`batch-config`)

複雑な一括同期設定を JSON ファイルで定義して実行できます。

#### 設定ファイルの作成

```json
{
  "version": "1.0.0",
  "description": "BoxPistols organization batch label sync",
  "defaults": {
    "template": "prod-ja",
    "mode": "append",
    "parallel": 3
  },
  "targets": [
    {
      "organization": "BoxPistols",
      "filter": {
        "visibility": "public",
        "language": "TypeScript",
        "archived": false
      },
      "template": "react",
      "mode": "append"
    },
    {
      "repositories": [
        "BoxPistols/labels-config",
        "BoxPistols/my-project"
      ],
      "template": "prod-ja",
      "mode": "replace"
    },
    {
      "user": "BoxPistols",
      "filter": {
        "visibility": "private"
      },
      "file": "./custom-labels.json"
    }
  ]
}
```

#### 設定ファイルの実行

```bash
# 設定ファイルを実行
labels-config batch-config batch-config.json

# ドライランで確認
labels-config batch-config batch-config.json --dry-run
```

#### 設定ファイルの構造

**ルート要素:**

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `version` | string | ✓ | 設定ファイルのバージョン |
| `description` | string | | 説明 |
| `defaults` | object | | デフォルト設定 |
| `targets` | array | ✓ | ターゲット設定のリスト |

**defaults オブジェクト:**

| フィールド | 型 | デフォルト | 説明 |
|-----------|-----|-----------|------|
| `template` | string | | デフォルトテンプレート |
| `mode` | `"append"` \| `"replace"` | `"append"` | デフォルト同期モード |
| `parallel` | number | `3` | デフォルト並列実行数 |

**target オブジェクト:**

| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| `organization` | string | * | 組織名 |
| `user` | string | * | ユーザー名 |
| `repositories` | string[] | * | リポジトリリスト |
| `template` | string | ** | テンプレート名 |
| `file` | string | ** | ラベルファイルパス |
| `mode` | `"append"` \| `"replace"` | | 同期モード |
| `parallel` | number | | 並列実行数 |
| `filter` | object | | フィルタ設定 |

\* いずれか1つ必須
\*\* いずれか1つ必須

**filter オブジェクト:**

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `visibility` | `"public"` \| `"private"` \| `"all"` | リポジトリの可視性 |
| `language` | string | プログラミング言語 |
| `archived` | boolean | アーカイブ済みリポジトリを含むか |

---

## 同期モード

### Append モード（デフォルト）

- 新しいラベルを追加
- 既存のラベルを更新
- 設定にないラベルは**保持**

```bash
labels-config batch-sync --org BoxPistols --template prod-ja
```

### Replace モード

- 新しいラベルを追加
- 既存のラベルを更新
- 設定にないラベルを**削除**

```bash
labels-config batch-sync --org BoxPistols --template prod-ja --delete-extra
```

---

## 利用例

### 例1: 組織の全TypeScriptリポジトリにReactテンプレートを適用

```bash
labels-config batch-sync \
  --org BoxPistols \
  --template react \
  --filter-lang TypeScript \
  --filter-vis public \
  --dry-run
```

### 例2: 複数の設定を一度に実行

batch-config.json:
```json
{
  "version": "1.0.0",
  "defaults": {
    "parallel": 5
  },
  "targets": [
    {
      "organization": "BoxPistols",
      "filter": { "language": "TypeScript" },
      "template": "react"
    },
    {
      "organization": "BoxPistols",
      "filter": { "language": "Go" },
      "template": "minimal"
    },
    {
      "repositories": ["BoxPistols/special-project"],
      "file": "./special-labels.json",
      "mode": "replace"
    }
  ]
}
```

実行:
```bash
labels-config batch-config batch-config.json
```

### 例3: 新規リポジトリへのラベル自動設置（GitHub Actionsと組み合わせ）

`.github/workflows/auto-label.yml`:
```yaml
name: Auto Label New Repositories
on:
  repository_dispatch:
    types: [new-repo-created]

jobs:
  apply-labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install labels-config
        run: npm install -g @asagiri-design/labels-config

      - name: Apply labels
        run: |
          labels-config batch-sync \
            --repos ${{ github.event.client_payload.repository }} \
            --template prod-ja
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## パフォーマンス最適化

### 並列処理

デフォルトでは3つのリポジトリを並列処理します。`--parallel` オプションで調整可能：

```bash
# 並列数を増やす（高速化）
labels-config batch-sync --org BoxPistols --template prod-ja --parallel 10

# 並列数を減らす（安定性重視）
labels-config batch-sync --org BoxPistols --template prod-ja --parallel 1
```

### レート制限への対応

GitHub API のレート制限を考慮して、並列数を調整してください：

- **認証済み**: 5000リクエスト/時間
- **並列数3**: 約100リポジトリ/分
- **並列数10**: 約300リポジトリ/分

---

## エラーハンドリング

### 部分的な失敗

一部のリポジトリで失敗しても、他のリポジトリの処理は継続されます：

```
✅ [1/10] BoxPistols/repo1
❌ [2/10] BoxPistols/repo2: Permission denied
✅ [3/10] BoxPistols/repo3
...

📊 Batch Sync Summary:
✅ Successful: 8
❌ Failed: 2

❌ Failed repositories:
  - BoxPistols/repo2: Permission denied
  - BoxPistols/repo5: Repository not found
```

### ドライランでの事前確認

本番実行前に必ずドライランで確認してください：

```bash
labels-config batch-sync --org BoxPistols --template prod-ja --dry-run
```

---

## よくある質問

### Q: 新規リポジトリ作成時に自動でラベルを設置できますか？

A: はい、GitHub Actions と組み合わせることで可能です。上記の「例3」を参照してください。

### Q: 既存のラベルを削除せずに追加だけできますか？

A: はい、デフォルトの Append モードで可能です（`--delete-extra` を指定しない）。

### Q: 組織の全リポジトリに一括適用できますか？

A: はい、`--org` オプションで可能です：
```bash
labels-config batch-sync --org BoxPistols --template prod-ja
```

### Q: 特定の条件でフィルタリングできますか？

A: はい、以下のフィルタが利用可能です：
- プログラミング言語（`--filter-lang`）
- 可視性（`--filter-vis`）
- アーカイブ状態（設定ファイルのみ）

---

## トラブルシューティング

### 権限エラー

```
Error: Permission denied for BoxPistols/repo1
```

**解決方法:**
1. `gh auth status` で認証状態を確認
2. `gh auth refresh` で認証を更新
3. リポジトリへの管理者権限を確認

### レート制限エラー

```
Error: API rate limit exceeded
```

**解決方法:**
1. 並列数を減らす（`--parallel 1`）
2. 時間を置いて再実行
3. GitHub Token の認証状態を確認

### リポジトリが見つからない

```
Error: Repository not found: BoxPistols/repo1
```

**解決方法:**
1. リポジトリ名のスペルを確認
2. リポジトリへのアクセス権限を確認
3. `gh repo list BoxPistols` でリポジトリ一覧を確認

---

## 参考資料

- [Getting Started](./GETTING_STARTED.md)
- [API Documentation](./API.md)
- [Templates](../templates/)
- [Examples](../examples/)
