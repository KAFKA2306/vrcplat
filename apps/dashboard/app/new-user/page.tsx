import type { Metadata } from 'next';

const purpose = [
  'KAFKA プラットフォームの初回セットアップ手順を日次ゼロ時点から整理する。',
  '連携アカウント、同意スコープ、主要画面の関係を深い利用前に理解できるようにする。',
  '詳細要件やプライバシー規約の参照先を提示し、後続ドキュメントへの遷移を助ける。',
];

const readers = [
  'KAFKA プロフィールの有効化を検討しているコミュニティ参加希望者。',
  'オンボーディング手順を復習したい既存ユーザー。',
  '初回セッションを伴走するサポートチームメンバー。',
];

const quickTerms = [
  {
    term: 'Presence',
    description:
      'VRChat や KAFKA Companion から集計した訪問履歴。各同意トグルの範囲に従う。',
  },
  {
    term: 'Loadout',
    description: 'アバターバージョン、衣装、目的地候補を束ねたプリセット。',
  },
  {
    term: 'Consent scope',
    description: '保存や推薦に利用するペイロードを機能単位で許可する仕組み。',
  },
];

const prerequisites = [
  'OAuth サインイン用に Discord、Google、X のいずれかのアカウントを用意する。',
  'BOOTH、Shopify、Gumroad、Patreon、fanbox など連携予定のストア認証情報を揃える。',
  'Presence を事前投入する場合は最新の VRCX 履歴 JSON をデスクトップから書き出す。',
  'データ保持期間と削除保証を理解するためプライバシー通知を確認する。',
];

const stepOne = [
  'オンボーディングページで利用する OAuth プロバイダを選択する (Discord、Google、X)。',
  '要求されたスコープを承認し、KAFKA が分散型識別子 (DID) を発行できるようにする。',
  'プロフィールハンドルとサポート連絡先 (メールや Discord) を設定する。',
];

const stepTwo = [
  'サインイン直後に表示される同意パネルを開く。',
  '許容できるスコープのみ有効化し、設定画面で随時更新できる点を把握する。',
  'Presence、Purchases、Avatar diff の挙動を理解するまで特に注意して確認する。',
  'タイムスタンプ付きの証跡が必要な場合は同意台帳をダウンロードする。',
];

const stepThree = [
  'Settings → Linked services へ移動する。',
  'ストアや支援サービス、SNS を一つずつ連携する。各要求の有効期限は 30 秒。',
  '同期ステータスピルを確認し、初回ペイロード取り込み後に緑へ変わることを確認する。',
  '再認可よりステータスログからの再試行が速い点を覚えておく。',
];

const historySteps = [
  'VRCX エクスポートを Presence インポータへドラッグし、訪問ワールドとインスタンス ID を補完する。',
  '購入確認メールを取り込み用エイリアスへ転送するか、過去注文の CSV をアップロードする。',
  '監査準備のため各ペイロードへ適切な同意スコープをタグ付けし、区分を維持する。',
];

const personalizeSteps = [
  'Presence lamp で頻繁に訪れるロケーションと相互同意済みフレンドをピン留めする。',
  '目立ちやすい衣装と行き先を組み合わせた初期 Loadout を作成する。',
  'Discord や X で同時告知する予定があれば Pinned notice コンポーザをブックマークする。',
];

const privacyChecks = [
  'Settings → Data export でドライランを実行し、ZIP に想定データが含まれるか確認する。',
  '重要度が低い Loadout を削除し、削除ワークフローの応答速度を確かめる。',
  '同意切り替えやインポートが全てタイムスタンプ付きで監査ログに残るか確認する。',
];

const firstWeek = [
  'ダッシュボード分析を閲覧し、CVI や UEI 指標が新しい活動でどう変化するか把握する。',
  '共有 Presence 表示が合流調整にどう役立つか、信頼できる友人からフィードバックを得る。',
  '詳細要件や API 契約は docs/requirement_draft.md を参照して補完する。',
  'ウェルカムメールのコミュニティチャンネルへ参加し、リリース情報を追う。',
];

const support = [
  'オンボーディングを妨げる課題があればフッターのサポートウィジェットからチケットを送る。',
  'データ書き出しや保持、同意撤回について不明点があればコンプライアンス担当へメールする。',
  'プロダクト課題はフィードバックボードで共有し、ロードマップ検証と紐付けてもらう。',
];

export const metadata: Metadata = {
  title: '新規ユーザーガイド',
};

export default function NewUserPage() {
  return (
    <main>
      <h1>新規ユーザーオンボーディングガイド</h1>
      <p>
        初回利用前に必要な準備と、サインイン後 1 週間の進め方をまとめました。プラットフォームの
        価値を最大化するため、順番に手順を確認してください。
      </p>

      <section>
        <h2>目的と範囲</h2>
        <ul>
          {purpose.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>対象読者</h2>
        <ul>
          {readers.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>用語の早見</h2>
        <dl>
          {quickTerms.map((item) => (
            <div key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>登録前の準備</h2>
        <ul>
          {prerequisites.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>ステップ 1: アカウント作成</h2>
        <ol>
          {stepOne.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section>
        <h2>ステップ 2: 同意スコープの確認</h2>
        <ol>
          {stepTwo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section>
        <h2>ステップ 3: 外部サービスの連携</h2>
        <ol>
          {stepThree.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section>
        <h2>ステップ 4: 履歴データの取り込み</h2>
        <ul>
          {historySteps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>ステップ 5: 発見体験の個別化</h2>
        <ul>
          {personalizeSteps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>ステップ 6: プライバシー制御の確認</h2>
        <ul>
          {privacyChecks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>最初の一週間で行うこと</h2>
        <ul>
          {firstWeek.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>サポート窓口</h2>
        <ul>
          {support.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
