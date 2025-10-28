import type {
  ExportBundleRequest,
  PresenceSession,
  PurchaseRecord
} from '@vrcplat/contracts';

const baseUserId = '00000000-0000-4000-8000-000000000001';

export const mockPresenceSessions: PresenceSession[] = [
  {
    id: '11111111-1111-4000-8000-000000000001',
    userId: baseUserId,
    worldId: 'wrld_kafka_world',
    instanceId: 'wrld_kafka_world:1234',
    enteredAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    source: 'beacon',
    visibility: 'friends',
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60_000).toISOString()
  },
  {
    id: '11111111-1111-4000-8000-000000000002',
    userId: baseUserId,
    worldId: 'wrld_collab_lounge',
    instanceId: 'wrld_collab_lounge:9999',
    enteredAt: new Date(Date.now() - 40 * 60_000).toISOString(),
    leftAt: new Date(Date.now() - 8 * 60_000).toISOString(),
    source: 'beacon',
    visibility: 'friends',
    createdAt: new Date(Date.now() - 40 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60_000).toISOString()
  },
  {
    id: '11111111-1111-4000-8000-000000000003',
    userId: baseUserId,
    worldId: 'wrld_artist_gallery',
    instanceId: 'wrld_artist_gallery:4242',
    enteredAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
    leftAt: new Date(Date.now() - 90 * 60_000).toISOString(),
    source: 'import',
    visibility: 'friends',
    createdAt: new Date(Date.now() - 2 * 60 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60_000).toISOString()
  }
];

export const mockPurchaseRecords: PurchaseRecord[] = [
  {
    id: '22222222-2222-4000-8000-000000000001',
    userId: baseUserId,
    provider: 'booth',
    itemId: 'booth-hero-cape',
    itemType: 'outfit',
    title: 'Hero Cape V2',
    description: 'Variant with reflective shader and masked physics.',
    price: {
      amount: 3_200,
      currency: 'JPY'
    },
    purchasedAt: new Date(Date.now() - 10 * 60_000).toISOString(),
    receiptRef: 'ORD-20251028-001',
    mediaUrls: ['https://example.com/cape.png'],
    linkedAvatarVersionId: '33333333-3333-4000-8000-000000000001',
    status: 'completed',
    createdAt: new Date(Date.now() - 10 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60_000).toISOString()
  },
  {
    id: '22222222-2222-4000-8000-000000000002',
    userId: baseUserId,
    provider: 'patreon',
    itemId: 'patreon-tier-2',
    itemType: 'subscription',
    title: 'Patreon Tier 2 - October',
    price: {
      amount: 12,
      currency: 'USD'
    },
    purchasedAt: new Date(Date.now() - 6 * 60 * 60_000).toISOString(),
    status: 'completed',
    createdAt: new Date(Date.now() - 6 * 60 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60_000).toISOString()
  }
];

export const mockExportBundles: ExportBundleRequest[] = [
  {
    userId: baseUserId,
    requestedAt: new Date(Date.now() - 30 * 60_000).toISOString(),
    status: 'ready',
    format: 'json',
    downloadUrl: 'https://example.com/export.zip',
    expiresAt: new Date(Date.now() + 2 * 60 * 60_000).toISOString(),
    checksum: '3c7f4e8b823fbd77f48c320c4fc7f44f3c7f4e8b823fbd77f48c320c4fc7f44f'
  },
  {
    userId: baseUserId,
    requestedAt: new Date(Date.now() - 4 * 60 * 60_000).toISOString(),
    status: 'processing',
    format: 'csv'
  }
];
