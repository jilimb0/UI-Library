import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Design System/Typography',
  tags: ['autodocs'],
};

export default meta;

export const Default = () => (
  <div className="space-y-4">
    <h1 className="text-4xl font-bold">Heading 1 - 4xl</h1>
    <h2 className="text-3xl font-semibold">Heading 2 - 3xl</h2>
    <p className="text-base">Body text base size</p>
    <code className="font-mono text-sm bg-gray-100 p-1 rounded">Code snippet</code>
  </div>
);
