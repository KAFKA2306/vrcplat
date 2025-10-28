'use client';

import { consentScopeValues } from '@vrcplat/contracts';
import { useSession } from '../session/use-session';
import { useConsentMutation } from './use-consent';

const labels = {
  'presence:self': { title: '自分の在室', detail: '自身のワールド入退室を保存して履歴と推薦に使います。' },
  'presence:friends': { title: 'フレンド在室', detail: '相互同意済みフレンドの在室を照合して表示します。' },
  'history:self': { title: '訪問履歴', detail: '過去の訪問履歴をホームと推薦に反映します。' },
  'purchases:self': { title: '購入履歴', detail: '支援・購入を集約し、ロードアウトに紐付けます。' },
  'avatar:meta': { title: 'アバターメタ', detail: 'アバターのバージョン情報を保持します。' },
  'avatar:diff': { title: 'アバター差分', detail: '差分メタデータを管理し公開範囲に反映します。' },
  'post:write': { title: '投稿連携', detail: '外部SNSへのマルチポストを許可します。' },
  'event:write': { title: 'イベント作成', detail: '集会リンクと招待の作成を許可します。' },
  'profile:pin': { title: 'プロフィール固定', detail: 'プロフィール上部の告知固定を許可します。' }
} satisfies Record<(typeof consentScopeValues)[number], { title: string; detail: string }>;

export function ConsentPanel() {
  const { data: session } = useSession();
  const mutation = useConsentMutation();
  const consent = session?.consent;
  if (!consent) return null;
  const scopes = consent.scopes;
  const viewScopes = mutation.isPending && mutation.variables ? mutation.variables : scopes;
  return (
    <section className="dashboard-card dashboard-stack">
      <div className="dashboard-stack__header">
        <div className="dashboard-pill dashboard-pill--accent">同意スコープ</div>
        <h2>データ利用の制御</h2>
        <p>機能単位でデータ利用を切り替え、変更は即時反映されます。</p>
      </div>
      <ul className="dashboard-toggle-list">
        {consentScopeValues.map(scope => {
          const meta = labels[scope];
          return (
            <li key={scope} className="dashboard-toggle">
              <div className="dashboard-toggle__copy">
                <h3>{meta.title}</h3>
                <p>{meta.detail}</p>
              </div>
              <label className="dashboard-switch">
                <input
                  type="checkbox"
                  checked={!!viewScopes[scope]}
                  onChange={() => mutation.mutate({ ...scopes, [scope]: !scopes[scope] })}
                  disabled={mutation.isPending}
                />
                <span />
              </label>
            </li>
          );
        })}
      </ul>
      <div className="dashboard-stack__footer">
        <span className="dashboard-pill">{mutation.isPending ? '同期中' : '最新状態'}</span>
      </div>
    </section>
  );
}
