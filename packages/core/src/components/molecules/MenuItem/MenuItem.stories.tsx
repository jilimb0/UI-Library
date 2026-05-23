import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { MenuItem } from './MenuItem';

const meta: Meta<typeof MenuItem> = {
  title: 'Components/Molecules/MenuItem',
  component: MenuItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    active: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof MenuItem>;

export const Default: Story = {
  args: {
    children: 'Menu Item',
    active: false,
  },
};

export const Active: Story = {
  args: {
    children: 'Active Menu Item',
    active: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <div className="flex items-center gap-2">
        <span>📁</span>
        <span>Documents</span>
      </div>
    ),
    active: false,
  },
};

export const Interaction: Story = {
  args: {
    children: 'Clickable Menu Item',
    active: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByText('Clickable Menu Item');
    await userEvent.click(item);
    await expect(item).toBeInTheDocument();
  },
};
