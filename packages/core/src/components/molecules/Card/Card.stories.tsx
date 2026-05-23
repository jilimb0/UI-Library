import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../../atoms/Button';
import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Molecules/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <Heading level={3}>Card Title</Heading>
        <Text className="mt-2">This is a simple card component.</Text>
      </div>
    ),
  },
};

export const WithActions: Story = {
  args: {
    children: (
      <div className="p-6">
        <Heading level={3}>Card with Actions</Heading>
        <Text className="mt-2 mb-4">This card includes action buttons.</Text>
        <div className="flex gap-2">
          <Button variant="primary" size="sm">
            Action
          </Button>
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
        </div>
      </div>
    ),
  },
};

export const WithPadding: Story = {
  args: {
    className: 'p-8',
    children: (
      <div>
        <Heading level={3}>Card with Custom Padding</Heading>
        <Text className="mt-2">This card has more padding.</Text>
      </div>
    ),
  },
};

export const Interaction: Story = {
  args: {
    children: (
      <div className="p-6">
        <Heading level={3}>Interactive Card</Heading>
        <Text className="mt-2 mb-4">Trigger action inside a card.</Text>
        <Button size="sm">Action</Button>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const action = canvas.getByRole('button', { name: 'Action' });
    await userEvent.click(action);
    await expect(action).toBeInTheDocument();
  },
};
