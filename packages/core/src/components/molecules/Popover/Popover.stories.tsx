import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
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
    trigger: (
      <button type="button" className="button button--default">
        Open popover
      </button>
    ),
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
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Open popover' }));
    await expect(await body.findByText('Popover Title')).toBeInTheDocument();
  },
};
