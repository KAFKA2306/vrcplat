'use client';

import { contractSchemas } from '@vrcplat/contracts';
import { useQuery } from '@tanstack/react-query';
import { sessionConfig } from '../session/use-session';

const base = sessionConfig.identityBaseUrl ? sessionConfig.identityBaseUrl.replace(/\/$/, '') : '';
const endpoint =
  process.env.NEXT_PUBLIC_PRESENCE_SESSIONS_URL ?? (base ? `${base}/presence/me` : '/api/presence/me');

async function fetchPresence() {
  const response = await fetch(endpoint, { credentials: 'include', cache: 'no-store' });
  const json = await response.json();
  return contractSchemas.presenceSession.array().parse(json);
}

export function usePresenceQuery() {
  return useQuery({ queryKey: ['presence', 'me'], queryFn: fetchPresence, staleTime: 15_000 });
}
