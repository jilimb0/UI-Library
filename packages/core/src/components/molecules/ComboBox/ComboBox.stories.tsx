import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { ComboBox } from './ComboBox';

const OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'svelte', label: 'Svelte' },
];

const meta: Meta<typeof ComboBox> = {
  title: 'Components/Molecules/ComboBox',
  component: ComboBox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ComboBox>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('');
      return (
        <ComboBox
          options={OPTIONS}
          value={value}
          onValueChange={setValue}
          placeholder="Search..."
        />
      );
    };
    return <Demo />;
  },
};

export const Interaction: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const input = canvas.getByPlaceholderText('Search...');
    await userEvent.click(input);
    await userEvent.type(input, 'Re');
    await userEvent.click(await body.findByRole('button', { name: 'React' }));
    await expect(input).toHaveValue('React');
  },
};
