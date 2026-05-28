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
    variant={selected ? 'default' : 'secondary'}
    onClick={onSelect}
    className="mr-2"
  >
    {children}
  </Button>
);

export const Default: Story = {
  render: (args) => {
    const [selectedValue, setSelectedValue] = useState('tab-1');

    return (
      <div>
        <Tabs {...args} value={selectedValue} onValueChange={setSelectedValue}>
          <TabButton
            selected={selectedValue === 'tab-1'}
            onSelect={() => setSelectedValue('tab-1')}
          >
            Tab 1
          </TabButton>
          <TabButton
            selected={selectedValue === 'tab-2'}
            onSelect={() => setSelectedValue('tab-2')}
          >
            Tab 2
          </TabButton>
          <TabButton
            selected={selectedValue === 'tab-3'}
            onSelect={() => setSelectedValue('tab-3')}
          >
            Tab 3
          </TabButton>
        </Tabs>
        <div className="mt-4 p-4 border rounded">
          {selectedValue === 'tab-1' && <p>Content for Tab 1</p>}
          {selectedValue === 'tab-2' && <p>Content for Tab 2</p>}
          {selectedValue === 'tab-3' && <p>Content for Tab 3</p>}
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
