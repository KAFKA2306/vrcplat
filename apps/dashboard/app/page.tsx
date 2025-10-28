import { DashboardShell } from '../src/app-shell/dashboard-shell';
import { getFocusPanels } from '../src/home/get-focus-panels';

export default function HomePage() {
  const focusPanels = getFocusPanels();

  return (
    <DashboardShell>
      <section aria-label="Home focus panels" className="dashboard-grid">
        {focusPanels.map((panel) => (
          <article key={panel.id} className="dashboard-card">
            <header>
              <div className="dashboard-pill dashboard-pill--accent">{panel.accent}</div>
              <h2>{panel.title}</h2>
            </header>
            <p>{panel.description}</p>
            <ul>
              {panel.checklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </DashboardShell>
  );
}
