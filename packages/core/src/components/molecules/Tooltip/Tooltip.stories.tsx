import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Molecules/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'This is a tooltip',
    children: <span className="button button--default">Hover me</span>,
  },
};

export const WithText: Story = {
  args: {
    content: 'Click this button to submit the form',
    children: <span className="button button--default">Submit</span>,
  },
};

export const WithLongText: Story = {
  args: {
    content:
      'This is a longer tooltip message that provides more detailed information about the element.',
    children: <span className="button button--secondary">Learn More</span>,
  },
};

export const Interaction: Story = {
  args: {
    content: 'Tooltip content',
    children: <span className="button button--default">Hover me</span>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Hover me' });
    await userEvent.hover(trigger);
    await expect(await body.findByText('Tooltip content')).toBeInTheDocument();
  },
};
