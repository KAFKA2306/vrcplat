'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';

type ReactQueryProviderProps = {
  children: ReactNode;
};

/**
 * React Query provider with defaults aligned to dashboard UX expectations.
 * - Stale data remains live for 30s to reduce refetch churn.
 * - Window focus and reconnect events keep data fresh without surprise refreshes mid-interaction.
 */
export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
            retry: 1
          },
          mutations: {
            retry: 0
          }
        }
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
