
import React from 'react';

export function Sidebar({ children }) {
  return (
    <aside style={{ width: '250px', background: '#f3f4f6', padding: '1rem' }}>
      {children}
    </aside>
  );
}
