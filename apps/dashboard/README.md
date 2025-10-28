# ダッシュボードアプリ

クリエイター、ファン、スポンサー向けの運用UI。Next.js 14 App Routerで構築されています。

## ローカル開発

- `pnpm install`
- `.env.example` を `.env.local` にコピーし（またはシェルでエクスポートし）、IDサービスのエンドポイントを設定します。
- `pnpm dev --filter apps/dashboard`

ダッシュボードシェルには、React Queryプロバイダー、セッションガード、レスポンシブナビゲーションが含まれています。

## 環境変数

| 変数 | 目的 | デフォルト |
| --- | --- | --- |
| `NEXT_PUBLIC_IDENTITY_BASE_URL` | IDサービス（`/session`, `/login`）のベースURL | _未設定_ |
| `NEXT_PUBLIC_IDENTITY_SESSION_URL` | `<base>/session` と異なる場合にセッションエンドポイント全体を上書きします | _任意_ |
| `NEXT_PUBLIC_IDENTITY_LOGIN_URL` | `<base>/login` と異なる場合にログインエントリポイントを上書きします | _任意_ |
| `NEXT_PUBLIC_DASHBOARD_SESSION_MODE` | 組み込みのデモプロファイルを使用するには `mock` に設定します | ベースURLがない場合は `mock` |
| `NEXT_PUBLIC_KAFKA_ENV` | ヘッダーに環境ピルをレンダリングします（`production`, `staging`, `preview`） | `preview` |
| `NEXT_PUBLIC_PRIVACY_CONSENT_URL` | `<base>/privacy/consent` と異なる場合に同意更新エンドポイントを上書きします | _任意_ |

`mock` モードでは、ダッシュボードはコントラクトで検証されたサンプルデータを使用してハイドレートします。実際のセッションを実行するには、IDサービスのURLを設定してください。

## プロジェクトのレイアウト

- `app/` – Next App Routerのルート、読み込みとエラーの境界、グローバルスタイル。
- `src/app-shell/` – ダッシュボードのクローム（ナビゲーション、ヘッダー、シェルCSS）。
- `src/providers/` – クライアントプロバイダー（`ReactQueryProvider`, `AppProviders`）。
- `src/session/` – セッションスキーマ、React Queryフック、ガード。
- `src/home/` – コントラクトに基づいたホームパネルの派生とモックペイロード。

## テスト

- `pnpm lint --filter @vrcplat/app-dashboard` はNext.jsのESLintチェックを実行します。
- Vitest UIテストはサーフェスビルドに付随します。スクリプトスタブは `package.json` にあります。

## 次のステップ

- IDサービスに到達可能になったら、モックセッションを `NEXT_PUBLIC_IDENTITY_BASE_URL` に切り替えます。
- サービスがオンラインになったら、ダッシュボードシェルの背後にある `/presence`、`/privacy`、およびその他のルートを拡張します。

## 進捗

- `/privacy` ページで同意スコープの切り替えが可能になりました。
