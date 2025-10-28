'use client';

import { useEffect } from 'react';
import './globals.css';
import '../src/app-shell/dashboard-shell.css';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Dashboard route error', error);
  }, [error]);

  return (
    <div className="dashboard-root">
      <div className="dashboard-guard">
        <div role="alert" className="dashboard-card dashboard-card--compact">
          <h2>Something went wrong</h2>
          <p>{error.message}</p>
          <div className="dashboard-guard__actions">
            <button type="button" className="dashboard-pill dashboard-pill--accent" onClick={() => reset()}>
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
