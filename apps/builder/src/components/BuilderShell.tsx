import type { ReactNode } from 'react';

type Props = {
  banner?: ReactNode;
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
};

export function BuilderShell({ banner = null, left, center, right }: Props) {
  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">UI Construction Builder</div>
        <div className="muted">
          Phase E collaboration and persistence polish
        </div>
      </header>
      {banner}
      <main className="layout">
        <section className="panel">{left}</section>
        <section className="panel">{center}</section>
        <section className="panel">{right}</section>
      </main>
    </div>
  );
}
