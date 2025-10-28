'use client';

import { useQuery } from '@tanstack/react-query';
import { sessionSchema, type Session } from './session-schema';

const identityBaseUrl = (process.env.NEXT_PUBLIC_IDENTITY_BASE_URL ?? '').replace(/\/$/, '');
const configuredSessionUrl = process.env.NEXT_PUBLIC_IDENTITY_SESSION_URL;
const configuredLoginUrl = process.env.NEXT_PUBLIC_IDENTITY_LOGIN_URL;
const sessionMode = process.env.NEXT_PUBLIC_DASHBOARD_SESSION_MODE ?? (identityBaseUrl ? 'api' : 'mock');

const sessionEndpoint =
  configuredSessionUrl ?? (identityBaseUrl ? `${identityBaseUrl}/session` : '/api/session');
const loginUrl =
  configuredLoginUrl ?? (identityBaseUrl ? `${identityBaseUrl}/login` : '/api/auth/login');

const fallbackSession: Session = {
  user: {
    id: '00000000-0000-4000-8000-000000000001',
    handle: 'kafka-dev',
    displayName: 'Kafka Dev',
    locale: 'en-US',
    avatarUrl: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=retro',
    createdAt: '2024-06-01T00:00:00.000Z',
    updatedAt: '2025-01-12T12:00:00.000Z'
  },
  consent: {
    userId: '00000000-0000-4000-8000-000000000001',
    scopes: {
      'presence:self': true,
      'presence:friends': true,
      'history:self': true,
      'purchases:self': true,
      'avatar:meta': true,
      'avatar:diff': false,
      'post:write': false,
      'event:write': true,
      'profile:pin': true
    },
    updatedAt: '2025-01-12T12:00:00.000Z'
  }
};

async function fetchSession(): Promise<Session | null> {
  if (sessionMode === 'mock') {
    return fallbackSession;
  }

  const response = await fetch(sessionEndpoint, {
    credentials: 'include',
    cache: 'no-store'
  });

  if (response.status === 204 || response.status === 401) {
    return null;
  }

  if (!response.ok) {
    const error = new Error(`Failed to load session (${response.status})`);
    error.name = 'SessionRequestError';
    throw error;
  }

  const json = await response.json();
  const payload = sessionSchema.parse(json);
  return payload;
}

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: fetchSession,
    staleTime: 60_000,
    refetchOnWindowFocus: true
  });
}

export const sessionConfig = {
  mode: sessionMode,
  endpoint: sessionEndpoint,
  loginUrl,
  identityBaseUrl
};
