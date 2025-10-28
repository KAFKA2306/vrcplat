'use client';

import { contractSchemas } from '@vrcplat/contracts';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sessionConfig } from '../session/use-session';

const base = sessionConfig.identityBaseUrl ? sessionConfig.identityBaseUrl.replace(/\/$/, '') : '';
const listEndpoint =
  process.env.NEXT_PUBLIC_PRIVACY_EXPORTS_URL ??
  (base ? `${base}/data/export` : '/api/data/export');
const deleteEndpoint =
  process.env.NEXT_PUBLIC_PRIVACY_DELETE_URL ??
  (base ? `${base}/data/delete` : '/api/data/delete');

async function fetchExports() {
  const response = await fetch(listEndpoint, { credentials: 'include', cache: 'no-store' });
  const json = await response.json();
  return contractSchemas.exportBundleRequest.array().parse(json);
}

export function useExportRequests() {
  return useQuery({ queryKey: ['data', 'exports'], queryFn: fetchExports, refetchInterval: 10_000 });
}

export function useExportMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (format: 'json' | 'csv') => {
      const response = await fetch(listEndpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ format })
      });
      const json = await response.json();
      return contractSchemas.exportBundleRequest.parse(json);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['data', 'exports'] });
    }
  });
}

export function useDeleteMutation() {
  return useMutation({
    mutationFn: async () => {
      await fetch(deleteEndpoint, {
        method: 'POST',
        credentials: 'include'
      });
    }
  });
}
