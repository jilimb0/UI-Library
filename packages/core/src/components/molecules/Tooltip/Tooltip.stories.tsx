import type { Meta, StoryObj } from '@storybook/react-vite';
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
