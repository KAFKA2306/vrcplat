import { DashboardShell } from '../../src/app-shell/dashboard-shell';
import { ConsentPanel } from '../../src/privacy/consent-panel';

export default function PrivacyPage() {
  return (
    <DashboardShell>
      <ConsentPanel />
    </DashboardShell>
  );
}
