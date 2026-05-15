import type { Meta } from '@storybook/react';

const meta: Meta = { title: 'Design System/Colors' };
export default meta;

export const Palette = () => (
  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
    {['bg-blue-600', 'bg-emerald-600', 'bg-amber-500', 'bg-rose-600'].map(
      (c) => (
        <div key={c} className="rounded border p-3">
          <div className={`h-16 rounded ${c}`} />
          <p className="mt-2 text-sm">{c}</p>
        </div>
      )
    )}
  </div>
);
