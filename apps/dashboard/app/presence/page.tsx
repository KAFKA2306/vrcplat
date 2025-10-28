import { DashboardShell } from '../../src/app-shell/dashboard-shell';
import { PresencePanel } from '../../src/presence/presence-panel';

export default function PresencePage() {
  return (
    <DashboardShell>
      <PresencePanel />
    </DashboardShell>
  );
}
