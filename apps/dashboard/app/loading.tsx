import './globals.css';
import '../src/app-shell/dashboard-shell.css';

export default function Loading() {
  return (
    <div className="dashboard-root">
      <div className="dashboard-guard">
        <div className="dashboard-card dashboard-card--compact">
          <div className="dashboard-skeleton dashboard-skeleton--title" />
          <div className="dashboard-skeleton dashboard-skeleton--body" />
          <div className="dashboard-skeleton dashboard-skeleton--body" />
        </div>
      </div>
    </div>
  );
}
