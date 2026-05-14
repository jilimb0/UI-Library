import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dropdown } from './Dropdown';

const mockItems = [
  { id: 1, label: 'Option 1', value: 'option1' },
  { id: 2, label: 'Option 2', value: 'option2' },
  { id: 3, label: 'Option 3', value: 'option3' },
  { id: 4, label: 'Option 4', value: 'option4' },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Molecules/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

export const Default: Story = {
  args: {
    items: mockItems,
    placeholder: 'Select an option',
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    items: mockItems,
    placeholder: 'Choose...',
  },
};

export const Disabled: Story = {
  args: {
    items: mockItems,
    placeholder: 'Select an option',
    disabled: true,
  },
};

export const WithOnChange: Story = {
  args: {
    items: mockItems,
    placeholder: 'Select an option',
    onChange: (value) => {
      console.log('Selected:', value);
    },
  },
};

export const ManyItems: Story = {
  args: {
    items: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      label: `Option ${i + 1}`,
      value: `option${i + 1}`,
    })),
    placeholder: 'Select from many options',
  },
};
