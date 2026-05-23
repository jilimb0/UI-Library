import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../../atoms/Button';
import { Popover } from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Components/Molecules/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: <Button>Open popover</Button>,
    content: (
      <div style={{ minWidth: 220 }}>
        <strong>Popover Title</strong>
        <p className="field-hint">Contextual content for quick actions.</p>
      </div>
    ),
  },
};

export const Interaction: Story = {
  args: Default.args,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open popover' }));
    await expect(canvas.getByText('Popover Title')).toBeInTheDocument();
  },
};
