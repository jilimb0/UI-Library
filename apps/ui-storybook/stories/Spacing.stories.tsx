import type { Meta } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Design System/Spacing',
  tags: ['autodocs'],
};

export default meta;

export const Default = () => (
  <div className="grid grid-cols-4 gap-4">
    <div className="h-8 bg-gray-300">8px</div>
    <div className="h-12 bg-gray-400">12px</div>
    <div className="h-16 bg-gray-500">16px</div>
    <div className="h-20 bg-gray-600">20px</div>
  </div>
);
