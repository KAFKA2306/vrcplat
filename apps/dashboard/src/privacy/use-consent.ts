'use client';

import { consentStateSchema } from '@vrcplat/contracts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Session } from '../session/session-schema';
import { sessionConfig } from '../session/use-session';

const base = sessionConfig.identityBaseUrl ? sessionConfig.identityBaseUrl.replace(/\/$/, '') : '';
const endpoint =
  process.env.NEXT_PUBLIC_PRIVACY_CONSENT_URL ?? (base ? `${base}/privacy/consent` : '/api/privacy/consent');

export function useConsentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (scopes: Record<string, boolean>) => {
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ scopes })
      });
      const json = await response.json();
      return consentStateSchema.parse(json);
    },
    onSuccess: data => {
      queryClient.setQueryData<Session | null>(['session'], value => {
        if (!value) return value;
        return { ...value, consent: data };
      });
    }
  });
}
