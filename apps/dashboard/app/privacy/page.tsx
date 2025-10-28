import { DashboardShell } from '../../src/app-shell/dashboard-shell';
import { ConsentPanel } from '../../src/privacy/consent-panel';
import { DataMaintenancePanel } from '../../src/privacy/data-maintenance-panel';

export default function PrivacyPage() {
  return (
    <DashboardShell>
      <div className="dashboard-grid">
        <ConsentPanel />
        <DataMaintenancePanel />
      </div>
    </DashboardShell>
  );
}
