import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Components/Molecules/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('');
      return <SearchInput value={value} onChange={setValue} debounceMs={200} />;
    };
    return <Demo />;
  },
};

export const Interaction: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText('Search...');
    await userEvent.type(input, 'kanban');
    await expect(input).toHaveValue('kanban');
  },
};
