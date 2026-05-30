import type { Meta, StoryObj } from '@storybook/react-vite';
import { Code } from './Code';

const meta: Meta<typeof Code> = {
  title: 'Components/Atoms/Code',
  component: Code,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Code>;

export const Default: Story = {
  args: {
    children: 'npm install @ui-construction-library/core',
  },
};
