import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'danger'],
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Checkbox> = {
  args: {
    label: 'This is a checkbox',
    size: 'md',
    variant: 'default',
  },
};

export const Checked: StoryObj<typeof Checkbox> = {
  args: {
    label: 'Checked checkbox',
    checked: true,
  },
};
