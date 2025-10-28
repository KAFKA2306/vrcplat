'use client';

import { useMemo, useState } from 'react';
import { useDeleteMutation, useExportMutation, useExportRequests } from './use-exports';

function formatTime(value: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

export function DataMaintenancePanel() {
  const exportsQuery = useExportRequests();
  const exportMutation = useExportMutation();
  const deleteMutation = useDeleteMutation();
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv'>('json');
  const exportsList = exportsQuery.data ?? [];
  const latestReady = useMemo(
    () =>
      exportsList
        .filter(item => item.status === 'ready')
        .sort((a, b) => Date.parse(b.requestedAt) - Date.parse(a.requestedAt))[0],
    [exportsList]
  );
  return (
    <section className="dashboard-card dashboard-stack">
      <div className="dashboard-stack__header">
        <div className="dashboard-pill dashboard-pill--accent">データ管理</div>
        <h2>エクスポートと削除</h2>
        <p>同意範囲内のデータを即時エクスポートし、削除要求をトラッキングします。</p>
      </div>
      <div className="maintenance-grid">
        <div className="maintenance-section">
          <h3>データエクスポート</h3>
          <div className="maintenance-choices">
            <label>
              <input
                type="radio"
                name="export-format"
                value="json"
                checked={selectedFormat === 'json'}
                onChange={() => setSelectedFormat('json')}
                disabled={exportMutation.isPending}
              />
              JSON
            </label>
            <label>
              <input
                type="radio"
                name="export-format"
                value="csv"
                checked={selectedFormat === 'csv'}
                onChange={() => setSelectedFormat('csv')}
                disabled={exportMutation.isPending}
              />
              CSV
            </label>
          </div>
          <button
            type="button"
            className="dashboard-pill dashboard-pill--accent maintenance-action"
            onClick={() => exportMutation.mutate(selectedFormat)}
            disabled={exportMutation.isPending}
          >
            エクスポートを要求する
          </button>
          {latestReady ? (
            <div className="maintenance-status">
              <span>最新のエクスポート: {formatTime(latestReady.requestedAt)}</span>
              <a href={latestReady.downloadUrl ?? '#'} className="dashboard-pill" target="_blank" rel="noreferrer">
                ダウンロード
              </a>
            </div>
          ) : (
            <div className="maintenance-status">
              <span>完了したエクスポートはまだありません。</span>
            </div>
          )}
        </div>
        <div className="maintenance-section">
          <h3>削除リクエスト</h3>
          <p className="maintenance-description">削除要求は即時キューに登録され、完了通知が返ります。</p>
          <button
            type="button"
            className="dashboard-pill maintenance-action"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            削除を要求する
          </button>
          <div className="maintenance-status">
            <span>{deleteMutation.isPending ? '削除ジョブを送信中です。' : '削除要求はいつでも取り消せます。'}</span>
          </div>
        </div>
      </div>
      <div className="dashboard-stack__footer">
        <span className="dashboard-pill">{exportsQuery.isFetching ? '同期中' : '最新状態'}</span>
      </div>
    </section>
  );
}
