# test2_TODO

Cursor お試し用の ToDo 関連の成果物をまとめたディレクトリです。`todo-app` と単体 HTML 版では **localStorage のキー**（`simple-todo-items`）を揃えており、同じブラウザプロファイル内でデータを共有できます。

## 構成

| 場所 | 種別 | 説明 |
| --- | --- | --- |
| [`todo-app/`](./todo-app/) | npm パッケージ（Next.js） | React + Bootstrap の ToDo。下記「todo-app の起動と中身」を参照。 |
| [`todo.html`](./todo.html) | 単一ファイル | HTML・CSS・JavaScript を 1 ファイルにまとめた ToDo。ブラウザで開くだけで動作（ビルド不要）。ダークテーマの独立実装。 |

どちらも追加・完了の切替・削除・「完了を削除」に対応しています。

---

## todo-app（Next.js パッケージ）

[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 由来の [Next.js](https://nextjs.org) プロジェクトです。Bootstrap でスタイルした ToDo リストで、データはブラウザの `localStorage`（キー: `simple-todo-items`）に保存されます。

### 成果物（`todo-app/` 配下の主なファイル）

| パス | 説明 |
| --- | --- |
| `todo-app/package.json` / `package-lock.json` | 依存関係（Next.js / React / Bootstrap 等）と npm スクリプト（`dev` / `build` / `start` / `lint`）。 |
| `todo-app/jsconfig.json` | `@/*` をパッケージルートにマップするパスエイリアス。 |
| `todo-app/next.config.mjs` | Next.js のビルド・実行向け設定。 |
| `todo-app/eslint.config.mjs` | ESLint（`eslint-config-next`）のルール。 |
| `todo-app/app/layout.js` | ルートレイアウト。メタデータ、Bootstrap CSS と `globals.css` の読み込み、`<body>` のラッパー。 |
| `todo-app/app/page.js` | トップページ。`TodoApp` のみを描画。 |
| `todo-app/app/globals.css` | 全体のベーススタイル（最小高さ、フォントスムージングなど）。 |
| `todo-app/app/components/TodoApp.js` | ToDo の UI と状態管理。`useSyncExternalStore` とインメモリストアで `localStorage` と同期。別タブは `storage` イベントで反映。 |
| `todo-app/public/*.svg` | テンプレート同梱の静的 SVG。現行の ToDo 画面では未使用。 |
| `todo-app/AGENTS.md` | AI エージェント向けの Next.js バージョン注意事項。 |
| `todo-app/CLAUDE.md` | `AGENTS.md` を参照するエージェント用エントリ。 |

### 開発サーバーの起動

ターミナルで `todo-app` に移動してから実行します。

```bash
cd todo-app
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認します。`todo-app/app/page.js` を編集するとホットリロードで反映されます。スタイルは [Bootstrap](https://getbootstrap.com/) を `layout.js` から読み込んでいます。

### Next.js の参考資料

- [Next.js ドキュメント](https://nextjs.org/docs) — 機能と API
- [Learn Next.js](https://nextjs.org/learn) — チュートリアル
- [Next.js GitHub](https://github.com/vercel/next.js)

### Vercel へのデプロイ

[公式のデプロイ案内](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) や [Next.js デプロイ手順](https://nextjs.org/docs/app/building-your-application/deploying) を参照してください。
