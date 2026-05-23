import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../../atoms/Button';
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
    children: <Button>Hover me</Button>,
  },
};

export const WithText: Story = {
  args: {
    content: 'Click this button to submit the form',
    children: <Button variant="primary">Submit</Button>,
  },
};

export const WithLongText: Story = {
  args: {
    content:
      'This is a longer tooltip message that provides more detailed information about the element.',
    children: <Button variant="secondary">Learn More</Button>,
  },
};

export const Interaction: Story = {
  args: {
    content: 'Tooltip content',
    children: <Button>Hover me</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Hover me' });
    await userEvent.hover(trigger);
    await expect(canvas.getByText('Tooltip content')).toBeInTheDocument();
  },
};
