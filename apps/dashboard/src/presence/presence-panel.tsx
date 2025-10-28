'use client';

import { useMemo } from 'react';
import { usePresenceQuery } from './use-presence';

function formatTime(value: string) {
  return new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

export function PresencePanel() {
  const { data } = usePresenceQuery();
  const sessions = data ?? [];
  const active = sessions.filter(session => !session.leftAt);
  const recent = sessions.filter(session => session.leftAt);
  const grouped = useMemo(
    () => ({
      active: active.slice(0, 6),
      recent: recent.slice(0, 10)
    }),
    [active, recent]
  );
  return (
    <section className="dashboard-stack">
      <div className="dashboard-card dashboard-stack">
        <div className="dashboard-stack__header">
          <div className="dashboard-pill dashboard-pill--accent">現在地</div>
          <h2>いま合流できるワールド</h2>
          <p>フレンド合意済みの在室。Companion を起動すると毎分更新されます。</p>
        </div>
        <ul className="presence-list">
          {grouped.active.length === 0 ? (
            <li className="presence-empty">現在オンラインのフレンドはいません。</li>
          ) : (
            grouped.active.map(session => (
              <li key={session.id} className="presence-item presence-item--active">
                <div>
                  <span className="presence-world">{session.worldId}</span>
                  <span className="presence-instance">{session.instanceId}</span>
                </div>
                <span className="presence-time">{formatTime(session.enteredAt)} 入室</span>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="dashboard-card dashboard-stack">
        <div className="dashboard-stack__header">
          <div className="dashboard-pill">履歴</div>
          <h2>直近の訪問</h2>
          <p>過去 24 時間の訪問ログ。ロードアウトや推薦に即時反映されます。</p>
        </div>
        <ul className="presence-list">
          {grouped.recent.length === 0 ? (
            <li className="presence-empty">表示できる履歴がありません。</li>
          ) : (
            grouped.recent.map(session => (
              <li key={session.id} className="presence-item">
                <div>
                  <span className="presence-world">{session.worldId}</span>
                  <span className="presence-instance">{session.instanceId}</span>
                </div>
                <span className="presence-time">
                  {formatTime(session.enteredAt)} 〜 {session.leftAt ? formatTime(session.leftAt) : '滞在中'}
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </section>
  );
}
