import type { ReactNode } from 'react';
import { DashboardHeader } from './dashboard-header';
import { DashboardNav } from './dashboard-nav';
import './dashboard-shell.css';
import { SessionGuard } from '../session/session-guard';

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="dashboard-root">
      <SessionGuard>
        <>
          <a className="skip-link" href="#main-content">
            Skip to main content
          </a>
          <div className="dashboard-shell">
            <aside className="dashboard-sidebar">
              <div className="dashboard-sidebar__inner">
                <div className="dashboard-sidebar__brand">
                  <span className="dashboard-sidebar__logo" aria-hidden="true">
                    ⌀
                  </span>
                  <span className="dashboard-sidebar__title">KAFKA</span>
                  <span className="dashboard-sidebar__subtitle">Creator platform</span>
                </div>
                <DashboardNav />
              </div>
            </aside>
            <div className="dashboard-main">
              <DashboardHeader />
              <main id="main-content" className="dashboard-content" role="main">
                {children}
              </main>
            </div>
          </div>
        </>
      </SessionGuard>
    </div>
  );
}
