'use client';

import type { ReactNode } from 'react';
import { sessionConfig, useSession } from './use-session';

type SessionGuardProps = {
  children: ReactNode;
};

export function SessionGuard({ children }: SessionGuardProps) {
  const { data, isLoading, isError, error, refetch } = useSession();

  if (isLoading) {
    return (
      <div className="dashboard-guard">
        <div className="dashboard-card dashboard-card--compact">
          <div className="dashboard-skeleton dashboard-skeleton--title" />
          <div className="dashboard-skeleton dashboard-skeleton--body" />
          <div className="dashboard-skeleton dashboard-skeleton--body" />
        </div>
      </div>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return (
      <div className="dashboard-guard">
        <div role="alert" className="dashboard-card dashboard-card--compact">
          <h2>We could not confirm your session</h2>
          <p>{message}</p>
          <div className="dashboard-guard__actions">
            <button type="button" className="dashboard-pill" onClick={() => refetch()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-guard">
        <div className="dashboard-card dashboard-card--compact">
          <h2>Sign in required</h2>
          <p>
            Your session expired or is not available yet. Continue to the identity portal to sign in
            and we will redirect back to the dashboard.
          </p>
          <div className="dashboard-guard__actions">
            <a href={sessionConfig.loginUrl} className="dashboard-pill dashboard-pill--accent">
              Sign in
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
