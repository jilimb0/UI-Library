import type { Meta } from '@storybook/react';

const meta: Meta = { title: 'Design System/Typography' };
export default meta;

export const Scale = () => (
  <div className="space-y-2">
    <h1 className="text-4xl font-bold">Heading 1</h1>
    <h2 className="text-3xl font-semibold">Heading 2</h2>
    <h3 className="text-2xl font-medium">Heading 3</h3>
    <p className="text-base">Body text</p>
  </div>
);
