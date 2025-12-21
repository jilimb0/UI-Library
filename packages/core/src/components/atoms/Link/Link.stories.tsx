
import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Components/Atoms/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'subtle'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: {
    href: '#',
    children: 'Default Link',
    variant: 'default',
  },
};

export const Subtle: Story = {
  args: {
    href: '#',
    children: 'Subtle Link',
    variant: 'subtle',
  },
};

export const External: Story = {
  args: {
    href: 'https://example.com',
    target: '_blank',
    rel: 'noopener noreferrer',
    children: 'External Link',
  },
};

export const WithCustomStyles: Story = {
  args: {
    href: '#',
    className: 'text-blue-600 font-semibold',
    children: 'Custom Styled Link',
  },
};
