export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside style={{ width: '250px', background: '#f3f4f6', padding: '1rem' }}>
      {children}
    </aside>
  );
}
