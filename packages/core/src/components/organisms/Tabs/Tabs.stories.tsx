import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../../atoms/Button';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Organisms/Tabs',
  component: Tabs,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const TabButton = ({ selected, onSelect, children }: any) => (
  <Button
    variant={selected ? 'primary' : 'secondary'}
    onClick={onSelect}
    className="mr-2"
  >
    {children}
  </Button>
);

export const Default: Story = {
  render: (args) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
      <div>
        <Tabs
          {...args}
          defaultIndex={selectedIndex}
          onChange={setSelectedIndex}
        >
          <TabButton>Tab 1</TabButton>
          <TabButton>Tab 2</TabButton>
          <TabButton>Tab 3</TabButton>
        </Tabs>
        <div className="mt-4 p-4 border rounded">
          {selectedIndex === 0 && <p>Content for Tab 1</p>}
          {selectedIndex === 1 && <p>Content for Tab 2</p>}
          {selectedIndex === 2 && <p>Content for Tab 3</p>}
        </div>
      </div>
    );
  },
};

export const Interaction: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Tab 2' }));
    await expect(canvas.getByText('Content for Tab 2')).toBeInTheDocument();
  },
};
