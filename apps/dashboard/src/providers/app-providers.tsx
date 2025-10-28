'use client';

import type { ReactNode } from 'react';
import { ReactQueryProvider } from './react-query-provider';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <ReactQueryProvider>{children}</ReactQueryProvider>;
}
