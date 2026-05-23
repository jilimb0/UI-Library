import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../../atoms/Button';
import { ContextMenu } from './ContextMenu';

const meta: Meta<typeof ContextMenu> = {
  title: 'Components/Molecules/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenu>;

const ITEMS = [
  { id: 'open', label: 'Open', onSelect: () => {} },
  { id: 'rename', label: 'Rename', onSelect: () => {} },
  {
    id: 'delete',
    label: 'Delete',
    variant: 'destructive' as const,
    onSelect: () => {},
  },
];

export const Default: Story = {
  args: {
    trigger: <Button>Right click me</Button>,
    items: ITEMS,
  },
};

export const Interaction: Story = {
  args: Default.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Right click me' });
    await userEvent.pointer([{ target: trigger, keys: '[MouseRight]' }]);
    await expect(canvas.getByText('Open')).toBeInTheDocument();
  },
};
