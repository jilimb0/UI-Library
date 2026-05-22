import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@ui-construction-library/core';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: 'Primary', variant: 'default', size: 'md' },
};

export const Outline: Story = {
  args: { children: 'Outline', variant: 'outline', size: 'md' },
};

export const Ghost: Story = {
  args: { children: 'Ghost', variant: 'ghost', size: 'sm' },
};
