import type { Meta, StoryObj } from '@storybook/react-vite';
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
