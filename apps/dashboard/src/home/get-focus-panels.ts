import { contractSchemas } from '@vrcplat/contracts';
import { mockExportBundles, mockPresenceSessions, mockPurchaseRecords } from './mock-data';

type FocusPanel = {
  id: 'now' | 'recent' | 'next';
  title: string;
  accent: string;
  description: string;
  checklist: string[];
};

function formatAgo(dateIso: string) {
  const now = Date.now();
  const minutes = Math.round((now - Date.parse(dateIso)) / 60000);
  if (minutes <= 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  return `${hours} h ago`;
}

function formatUntil(dateIso: string) {
  const now = Date.now();
  const minutes = Math.max(0, Math.round((Date.parse(dateIso) - now) / 60000));
  if (minutes <= 1) return 'in under 1 min';
  if (minutes < 60) return `in ${minutes} min`;
  const hours = Math.round(minutes / 60);
  return `in ${hours} h`;
}

export function getFocusPanels(): FocusPanel[] {
  const sessionRecords = mockPresenceSessions.map((row) => contractSchemas.presenceSession.parse(row));
  const purchaseRecords = mockPurchaseRecords.map((row) => contractSchemas.purchaseRecord.parse(row));
  const exportBundles = mockExportBundles.map((row) => contractSchemas.exportBundleRequest.parse(row));

  const onlineNow = sessionRecords.filter((session) => !session.leftAt);
  const withinDay = sessionRecords.filter((session) => Date.now() - Date.parse(session.enteredAt) <= 24 * 60 * 60 * 1000);

  const purchasesWithinDay = purchaseRecords.filter(
    (purchase) => Date.now() - Date.parse(purchase.purchasedAt) <= 24 * 60 * 60 * 1000
  );

  const latestExport = exportBundles.find((bundle) => bundle.status === 'ready');
  const processingExports = exportBundles.filter((bundle) => bundle.status === 'processing').length;

  return [
    {
      id: 'now',
      title: 'Now',
      accent: 'Presence lamp',
      description: 'Live rooms from consented friends and teams. Sync companion beacon for minute-level pulses.',
      checklist: [
        `${onlineNow.length} active room${onlineNow.length === 1 ? '' : 's'}`,
        `Last ping ${formatAgo(sessionRecords[0]?.updatedAt ?? new Date().toISOString())}`,
        `${withinDay.length} visits logged in 24h`
      ]
    },
    {
      id: 'recent',
      title: 'Recent',
      accent: 'Last 24 hours',
      description: 'Summary of purchases, loadouts, and exports touched since yesterday.',
      checklist: [
        `${purchasesWithinDay.length} new purchase${purchasesWithinDay.length === 1 ? '' : 's'}`,
        latestExport && latestExport.expiresAt
          ? `Export bundle ready (expires ${formatUntil(latestExport.expiresAt)})`
          : 'No export bundles ready',
        processingExports ? `${processingExports} export job${processingExports === 1 ? '' : 's'} processing` : 'No export jobs running'
      ]
    },
    {
      id: 'next',
      title: 'Next',
      accent: 'Upcoming',
      description: 'Prep upcoming events, posts, and avatar diff captures before your next session.',
      checklist: [
        'Schedule fan meetup draft',
        'Attach purchase receipts to avatar loadouts',
        'Queue multi-post for Patreon + Discord'
      ]
    }
  ];
}

export type { FocusPanel };
