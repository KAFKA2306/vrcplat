'use client';

import { useQuery } from '@tanstack/react-query';
import { sessionConfig } from '../session/use-session';

type BeaconStatus = {
  status: 'online' | 'offline' | 'unknown';
  lastPingAt?: string;
};

const base = sessionConfig.identityBaseUrl ? sessionConfig.identityBaseUrl.replace(/\/$/, '') : '';
const endpoint =
  process.env.NEXT_PUBLIC_PRESENCE_BEACON_URL ??
  (base ? `${base}/presence/beacon` : '/api/presence/beacon');

async function fetchBeaconStatus(): Promise<BeaconStatus> {
  const response = await fetch(endpoint, { credentials: 'include', cache: 'no-store' });
  return response.json();
}

export function useBeaconStatus() {
  return useQuery({ queryKey: ['presence', 'beacon'], queryFn: fetchBeaconStatus, staleTime: 15_000 });
}
