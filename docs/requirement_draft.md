
# KAFKA Metaverse Platform 要件定義 v1.0

## 0. 目的と範囲

* **目的**: クリエイター価値の拡張を中核に、VRChatを中心とした発信・支援・来場・購入・改変の**全履歴を賢く集約**し、**選べる・投稿できる・つながる**体験を高UXで提供する。
* **範囲**: アカウント/同意・外部連携・在室/履歴・購入・アバター改変・投稿/告知・集会リンク・推薦/検索・ダッシュボード・モデレーション・決済/支援（連携）・データ/ログ・非機能。

## 1. ステークホルダー

* クリエイター（活動家含む）
* ファン/来場者（ユーザー）
* ブランド/スポンサー
* 運営/審査/CS/会計
* コンプラ/法務

## 2. 用語（抜粋）

* **Presence**: ワールドID/インスタンスIDと入退室時刻のペイロード（位置座標や音声は扱わない）
* **CVI/UEI**: 価値指標（設計は別紙、ここでは利用前提）
* **Consent Scope**: 機能単位の同意トグル（§5）

---

## 3. ユーザーストーリー（代表10）

1. ユーザーとして、**自分/同意済みフレンドの在室**を一覧で見たい（今どこで集まれるか判断したい）。
2. ユーザーとして、**自分の来訪履歴**（24h/7d/30d）を見て、**ワンクリ再訪**したい。
3. ユーザーとして、**BOOTHやShopify等の購入履歴**を一画面に集約したい（領収と装備の紐付け）。
4. クリエイターとして、**アバター改変の差分メタ**（Mesh/Mat/Physbone/Script）を記録・公開/非公開管理したい。
5. クリエイターとして、**衣装/ファンボ/Patreonの告知**を**上段ピン留め**し、複数SNSに自動投稿したい。
6. 主催者として、**集会リンク（単発/定期）**を作成し、**合流率**をトラッキングしたい。
7. ユーザーとして、**今日の装備（Loadout）**を“推奨衣装×行先”でAI提案してほしい。
8. クリエイターとして、**支援/購入/合流/コラボ成立**を**称号/カード**でSNS共有させたい（口コミを誘発）。
9. 全員として、**データの公開粒度**を**スコープ単位で即時変更**し、**エクスポート/削除**できる安心がほしい。
10. 運営として、**違反通報→即時非表示→監査**までのモデレーション動線が必要。

---

## 4. 主要機能要件（機能→受入基準→UI→API/データ）

### 4.1 アカウント/認証/同意

* **要件**

  * OAuth2(Discord/Google/X/YouTube)で登録。DIDを内部発行。
  * **Consent Scope** を初回オンボーディングと設定画面で付与/解除可能。
  * エクスポート(JSON/CSV)・削除(忘れられる権利)を即時処理。
* **受入基準**

  * 同意オフのデータは**取得・表示・推薦**に使われない。
  * エクスポートは1分以内にダウンロード可能、削除はジョブ完了通知を返す。
* **主要UI**: `ConsentToggle` 群、データダウンロード/削除ボタン
* **API**

  * `POST /auth/link`（provider, code）
  * `GET /privacy/consent` / `PATCH /privacy/consent`
  * `POST /data/export` / `POST /data/delete`

### 4.2 外部連携（1クリック）

* **要件**

  * X/YouTube/Discord/BOOTH/Shopify/Gumroad/Patreon/fanbox/ブログRSS をボタン一発で接続。
  * Webhook/定期Pullで投稿/支援/購入/動画等を同期。
* **受入基準**

  * 連携30秒内に**統合プロフィールに初期反映**。失敗時はリトライ+UIで明示。
* **API/Webhook**

  * `/hooks/x`, `/hooks/youtube`, `/hooks/shopify`, `/hooks/gumroad`, `/hooks/patreon`, `/hooks/fanbox`, `/hooks/booth`, `/hooks/rss`

### 4.3 Presence（在室）/ 履歴

* **要件**

  * **VRCX履歴JSONの手動アップロード**対応。
  * **KAFKA Companion（Udon/OSC）**で`world_id/instance_id/入退室時刻`のみ送信（匿名トークン）。
  * フレンド在室は**相互同意**がある相手のみ表示。
* **受入基準**

  * リアル位置は扱わない。履歴はデフォルト非公開。
  * ホームに「いま/最近/次の一手」を3パネルで提示。
* **主要UI**: `PresenceLamp`, `WorldCard`, 履歴タイムライン
* **API**

  * `POST /presence/ping`（匿名sub, world_id, instance_id, joined, ts）
  * `GET /presence/me` / `GET /presence/friends`
  * `POST /import/vrcx`

### 4.4 購入/支援の集約

* **要件**

  * BOOTH/Shopify/Gumroad/Patreon/fanbox の支払い履歴集約。領収メールの転送取込も可。
  * アイテム種別・価格・通貨・購入日時・リンク・スクショ/領収IDを保持。**装備/衣装に紐付け**可能。
* **受入基準**

  * 同一注文の重複を自動解消。フィルタと検索が100ms台で応答。
* **UI**: `PurchaseCell`（ストアアイコン付）、装備紐付けUI
* **API**

  * `GET /purchases?type=&store=&range=`
  * `POST /import/receipt`（メール転送/CSV）

### 4.5 アバター改変（Diffメタ）

* **要件**

  * アバター→バージョン列→各バージョンに**差分メタ**（mesh_added, mat_swap, physbone_edit, script_added など）。
  * モデルデータ本体は扱わない。**メタ情報のみ**。
  * **クレジット自動生成**（作者・販売ページ・ライセンスURL）。
* **受入基準**

  * 差分登録/編集は30秒以内完了、公開/非公開切替は即時反映。
* **UI**: `AvatarDiffList`, `CreditCard`
* **API**

  * `GET /avatars/:id/versions` / `POST /avatars/:id/versions`
  * `POST /avatar_versions/:id/diffs`

### 4.6 選べる（セレクタ/Loadout）

* **要件**

  * アバター/衣装/ワールド/イベントを横タブで検索・推薦。
  * **Loadout**＝アバターver＋衣装セット＋行先候補を保存/適用。
  * 推薦は履歴/在室/購入作者/光源相性等のシグナルで最適化。
* **受入基準**

  * 推薦応答 < 500ms、Loadout保存 < 1s。
* **UI**: `SelectorTabs`, `LoadoutEditor`
* **API**

  * `GET /recommendations?mode=`
  * `POST /loadouts`, `GET /loadouts`

### 4.7 投稿（マルチポスト）/ 告知（衣装/ファンボ）

* **要件**

  * テキスト/画像/短動画/リンクを**同時にX/Discord/YouTubeコミュニティへ**投稿（予約投稿可）。
  * 告知はプロフィール上段ピン留め。OGP最適化。
* **受入基準**

  * 投稿作成→外部反映まで60秒以内。失敗時の再送管理あり。
* **UI**: `PostComposer`, `PinnedNotice`
* **API**

  * `POST /posts`（kind, media, schedule）
  * `PATCH /profile/pinned`

### 4.8 集会リンク（Linkスク）

* **要件**

  * `title, world_url, start_at, host, tags, 参加条件`でカード生成。
  * 1回限り/期限付き招待URLを発行。**合流率/転換率**を記録。
* **受入基準**

  * 共有リンクの踏み → クライアントにワールド起動パラメータを渡す。
* **UI**: `EventChip`, `JoinNow`
* **API**

  * `POST /events`, `GET /events?range=&tag=`, `POST /events/:id/invite`

### 4.9 検索/推薦（賢い集約）

* **要件**

  * 統合プロフィールに、外部発信/支援/購入/来場/改変/告知が自動統合。
  * **意味検索**（Embedding）と**全文検索**の両輪。
* **受入基準**

  * 検索応答 < 300ms（キャッシュヒット時）、< 800ms（コールド）。
* **UI**: `GlobalSearch`, `SmartFeed`
* **API**

  * `GET /search?q=&type=world|post|purchase|avatar`

### 4.10 モデレーション/安全性

* **要件**

  * 相互同意+ブロック尊重で在室表示。NSFWは標準OFF、年齢認証でON可。
  * 通報→即時非表示→審査キュー→監査ログ保存。
* **受入基準**

  * 通報後10秒以内に一時非表示。監査ログは改変不可。
* **UI**: `ReportButton`, `MuteToggle`
* **API**

  * `POST /reports`, `POST /blocks`

---

## 5. 同意スコープ（Privacy by Design）

* `presence:self` / `presence:friends`
* `history:self`
* `purchases:self`
* `avatar:meta` / `avatar:diff`
* `post:write`
* `event:write`
* `profile:pin`

> いずれも**即時ON/OFF反映**、用途説明テキスト必須、監査ログ保存。

---

## 6. データモデル（必須テーブル）

* `users(id, handle, did, locale, privacy_flags, created_at)`
* `external_accounts(id, user_id, provider, account_ref, scopes, linked_at)`
* `friends(user_id, friend_id, consent_presence, created_at)`
* `worlds(id, platform, slug, title, tags[], author, nsfw, url, thumb_url)`
* `instances(id, world_id, instance_code, capacity, region, created_at)`
* `sessions(id, user_id, world_id, instance_id, entered_at, left_at, source)`
* `purchases(id, user_id, store, item_id, item_type, title, price, currency, purchased_at, receipt_ref, media_url)`
* `avatars(id, user_id, name, base_model_ref, author, license_url, visibility)`
* `avatar_versions(id, avatar_id, version, created_at, notes)`
* `avatar_diffs(id, avatar_version_id, diff_type, payload_json, created_at)`
* `posts(id, user_id, kind, text, media_urls[], link_url, visibility, created_at)`
* `events(id, host_user_id, title, world_id, start_at, end_at, link_url, tags[], visibility)`
* `loadouts(id, user_id, title, avatar_version_id, outfit_refs[], world_candidates[], created_at)`
* `reports(id, target_type, target_id, reporter_id, reason, created_at, status)`
* `audit_logs(id, actor_id, action, target, payload, created_at, hash)`

---

## 7. 画面制約/UXガイド（口コミ誘発）

* **3パネル原則**: ホームは「いま / 最近 / 次の一手」。
* **1アクション到達**: どの画面からも**1クリックで参加/共有**へ。
* **称号カード**: 支援/購入/合流/コラボ成立で即生成（SNS共有ボタン常設）。
* **負荷最適**: 画像は遅延ロード、サムネはWebP、LCP<2.5s。
* **アクセシビリティ**: 主要操作はキーボード操作可能、コントラスト4.5:1以上。

---

## 8. 非機能要件（抜粋）

* **性能**: 99p API応答<800ms、検索<800ms、推薦<500ms。
* **可用性**: 月間稼働率 99.9%。
* **セキュリティ**: OAuth2/OIDC、JWT回転、CSP/CSRF/RateLimit、データ暗号化（転送+保管）。
* **プライバシー**: デフォ非公開、細粒度同意、エクスポート/削除、監査ログ改ざん耐性（ハッシュ鎖）。
* **国際化**: ja/en i18n、時区分はユーザーTZ。
* **法令**: 個人情報/電通法/景表法/著作権/特商法の運用基準を運用SOPに明記。

---

## 9. 観測/KPI

* **体験**: ワンクリ参加率、合流率、合流までの中央値、週次復帰率。
* **経済**: 支援/購入の転換率、告知→参加率、Loadout使用率。
* **拡散**: 称号カード共有率、共有→新規登録率。
* **信頼**: 通報→非表示時間、再発率、同意変更の即時反映率。

---

## 10. リリース分割（3スプリント）

* **S1（足跡・在室・同意）**: VRCXインポート、Presence Beacon、履歴UI、Consent/Export/Delete。
* **S2（購入/改変/装備）**: 購入集約、AvatarDiffメタ、Loadout保存、称号カード共有。
* **S3（集会/投稿/推薦）**: 集会リンク、マルチ投稿、推薦v1、エンベディング検索。

---

## 11. 受入テスト例（抜粋）

* 在室表示は**相互同意が無い相手**は出ない。
* 履歴を**非公開**にすると、検索/推薦にも使われない。
* 同一購入がWebhookとCSVで二重登録されない。
* 改変メタの公開/非公開切替が**即時**にプロフィールへ反映。
* 集会カードから**1クリック**でクライアント起動できる。
* 投稿予約が外部SNSに**60秒以内**で反映。失敗時は再送履歴が残る。
* データ削除後、関連検索/推薦から項目が除外される（キャッシュ無効化含む）。

---

## 12. リスクと回避

* **非公認API依存**: 採用しない。ユーザー主導アップロード/Beaconで代替。
* **プライバシー**: 粒度同意+既定非公開、履歴TTL、可視性ラベル徹底。
* 
