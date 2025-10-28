'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  label: string;
  description: string;
  href: string;
  status?: 'beta' | 'soon';
  disabled?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    title: 'Pulse',
    items: [
      {
        label: 'Overview',
        description: 'Now / recent / next panels',
        href: '/'
      },
      {
        label: 'Presence',
        description: 'Real-time rooms & consent',
        href: '/presence',
        status: 'beta'
      },
      {
        label: 'Purchases',
        description: 'Receipts, duplicates, CVI',
        href: '/purchases',
        status: 'soon',
        disabled: true
      }
    ]
  },
  {
    title: 'Creation',
    items: [
      {
        label: 'Avatars',
        description: 'Versions, diffs, credits',
        href: '/avatars',
        status: 'soon',
        disabled: true
      },
      {
        label: 'Events',
        description: 'Join links & conversion',
        href: '/events',
        status: 'soon',
        disabled: true
      },
      {
        label: 'Posts',
        description: 'Multi-channel notices',
        href: '/posts',
        status: 'soon',
        disabled: true
      }
    ]
  },
  {
    title: 'Governance',
    items: [
      {
        label: 'Consent & privacy',
        description: 'Scopes, export, deletion',
        href: '/privacy',
        status: 'beta'
      },
      {
        label: 'Audit log',
        description: 'Scope transitions & jobs',
        href: '/audit-log',
        status: 'soon',
        disabled: true
      }
    ]
  }
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="dashboard-nav" aria-label="Primary">
      {navSections.map((section) => (
        <div key={section.title} className="dashboard-nav__section">
          <span className="dashboard-nav__title">{section.title}</span>
          <div className="dashboard-nav__items">
            {section.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              const classNames = [
                'dashboard-nav__link',
                isActive ? 'dashboard-nav__link--active' : null
              ]
                .filter(Boolean)
                .join(' ');

              const badge =
                item.status === 'beta'
                  ? 'Beta'
                  : item.status === 'soon'
                  ? 'Soon'
                  : undefined;

              return (
                <Link
                  key={item.label}
                  href={item.disabled ? '#' : item.href}
                  className={classNames}
                  aria-current={isActive ? 'page' : undefined}
                  aria-disabled={item.disabled ? 'true' : undefined}
                  prefetch={!item.disabled}
                >
                  <span className="dashboard-nav__info">
                    <span className="dashboard-nav__label">{item.label}</span>
                    <span className="dashboard-nav__description">{item.description}</span>
                  </span>
                  {badge ? <span className="dashboard-nav__badge">{badge}</span> : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
