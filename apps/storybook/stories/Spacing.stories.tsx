import type { Meta } from '@storybook/react';

const meta: Meta = { title: 'Design System/Spacing' };
export default meta;

export const Scale = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((n) => (
      <div key={n} className={`h-4 bg-slate-300 p-${n}`}>
        space-{n}
      </div>
    ))}
  </div>
);
