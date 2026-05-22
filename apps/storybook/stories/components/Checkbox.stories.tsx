import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@ui-construction-library/core';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Include integrations',
    defaultChecked: true,
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Accept terms',
    description: 'Required before publishing your workspace.',
  },
};
