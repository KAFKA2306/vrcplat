'use client';

import Image from 'next/image';
import { useMemo } from 'react';
import { useSession, sessionConfig } from '../session/use-session';
import { useBeaconStatus } from '../presence/use-beacon';

const environment = process.env.NEXT_PUBLIC_KAFKA_ENV ?? 'preview';

function initialsFromName(name: string) {
  const [first = '', second = ''] = name.split(' ');
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase() || 'U';
}

export function DashboardHeader() {
  const { data: session } = useSession();
  const { data: beacon } = useBeaconStatus();
  const environmentLabel = useMemo(() => {
    switch (environment) {
      case 'production':
        return 'Production';
      case 'staging':
        return 'Staging';
      default:
        return 'Preview';
    }
  }, []);

  const scopes = session?.consent?.scopes;
  const totalScopes = scopes ? Object.keys(scopes).length : 0;
  const grantedScopes = scopes ? Object.values(scopes).filter(Boolean).length : 0;
  const consentLabel = totalScopes ? `${grantedScopes}/${totalScopes} scopes granted` : 'Scopes pending';

  const displayName = session?.user?.displayName ?? 'Unknown user';
  const userHandle = session?.user?.handle ? `@${session.user.handle}` : 'handle pending';
  const avatarUrl = session?.user?.avatarUrl;
  const loginUrl = sessionConfig.loginUrl;
  const beaconLabel = beacon?.status === 'online' ? 'Beacon live' : 'Beacon offline';
  const beaconClass = beacon?.status === 'online' ? 'dashboard-pill beacon-pill--online' : 'dashboard-pill';
  const beaconPing = beacon?.lastPingAt
    ? new Intl.DateTimeFormat('ja-JP', { hour: '2-digit', minute: '2-digit' }).format(new Date(beacon.lastPingAt))
    : null;

  return (
    <header className="dashboard-header">
      <div className="dashboard-header__meta">
        <span>Creator ops cockpit</span>
        <h1>Activity pulse</h1>
      </div>
      <div className="dashboard-header__actions">
        <div className="dashboard-pill dashboard-pill--accent">{environmentLabel}</div>
        <div className={beaconClass} aria-live="polite">
          {beaconLabel}
          {beaconPing ? ` · ${beaconPing}` : ''}
        </div>
        <button
          type="button"
          className="dashboard-pill"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open('/new-user', '_blank', 'noopener');
            }
          }}
        >
          View onboarding
        </button>
        <a href={loginUrl} className="dashboard-user">
          {avatarUrl ? (
            <span className="dashboard-user__avatar-image">
              <Image src={avatarUrl} alt={`${displayName} avatar`} width={32} height={32} />
            </span>
          ) : (
            <span className="dashboard-user__avatar">{initialsFromName(displayName)}</span>
          )}
          <span className="dashboard-user__meta">
            <span className="dashboard-user__name">{displayName}</span>
            <span className="dashboard-user__sub">{consentLabel}</span>
          </span>
          <span className="dashboard-user__handle">{userHandle}</span>
        </a>
      </div>
    </header>
  );
}
