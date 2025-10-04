# プロジェクト構成

`vertical` リポジトリは、`site/` ディレクトリ配下の React + TypeScript + Vite アプリケーションで構成されています。Node.js 環境で動作し、npm を利用して依存関係を管理します。

## ルートディレクトリ

```
vertical/
`-- site/
```

- `site/`: React + TypeScript + Vite で構築されたフロントエンドアプリケーションです。

## `site/` ディレクトリ構成

```
site/
|-- README.md                # 本ファイル
|-- package.json             # npm スクリプトと依存関係の定義
|-- package-lock.json        # 依存関係のバージョン固定ファイル
|-- eslint.config.js         # ESLint の設定
|-- tsconfig.json            # TypeScript 共通設定
|-- tsconfig.app.json        # アプリ用 TypeScript 設定
|-- tsconfig.node.json       # Node 用 TypeScript 設定
|-- vite.config.ts           # Vite のビルド/開発サーバー設定
|-- public/
|   `-- vite.svg             # 公開される静的アセット
|-- src/
|   |-- App.tsx              # ルート React コンポーネント
|   |-- App.css              # App コンポーネント用スタイル
|   |-- main.tsx             # React アプリのエントリーポイント
|   |-- index.css            # グローバルスタイル
|   `-- assets/
|       `-- react.svg        # React ロゴアセット
`-- node_modules/            # インストール済み依存パッケージ（詳細省略）
```

`node_modules/` 配下は npm により取得された多数のファイルで構成されているため、一覧ではディレクトリ名のみ記載しています。

## 開発メモ

1. 依存関係のインストールは `site/` ディレクトリで `npm install` を実行してください。
2. 開発サーバーは `npm run dev` で起動できます。

この README はプロジェクトのディレクトリ構成を素早く把握するためのリファレンスです。
