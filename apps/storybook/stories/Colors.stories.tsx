import type { Meta } from '@storybook/react';

const meta: Meta = {
  title: 'Design System/Colors',
  tags: ['autodocs'],
};

export default meta;

export const Primary = () => (
  <div className="grid grid-cols-4 gap-4">
    <div className="bg-blue-500 h-20 rounded flex items-center justify-center text-white">
      Primary
    </div>
    <div className="bg-blue-600 h-20 rounded flex items-center justify-center text-white">
      Primary Dark
    </div>
  </div>
);
