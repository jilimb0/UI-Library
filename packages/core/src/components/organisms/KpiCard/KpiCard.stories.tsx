import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrendingUpIcon } from '@ui-construction-library/icons';
import { KpiCard } from './KpiCard';

const meta: Meta<typeof KpiCard> = {
  title: 'Components/Organisms/KpiCard',
  component: KpiCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'error'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '$45,230',
    subtext: '+20.1% vs last month',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Active Users',
    value: '2,847',
    subtext: '+12% this week',
    icon: <TrendingUpIcon size={16} />,
  },
};

export const Success: Story = {
  args: {
    label: 'Conversion Rate',
    value: '3.24%',
    subtext: 'Above target',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    label: 'Bounce Rate',
    value: '42.1%',
    subtext: 'Needs attention',
    variant: 'warning',
  },
};

export const ErrorRate: Story = {
  args: {
    label: 'Error Rate',
    value: '1.2%',
    subtext: 'Critical threshold',
    variant: 'error',
  },
};

export const Selected: Story = {
  args: {
    label: 'Selected Metric',
    value: '99.9%',
    subtext: 'Click to deselect',
    selected: true,
    onClick: () => {},
  },
};

export const Interactive: Story = {
  args: {
    label: 'Click me',
    value: '42',
    subtext: 'This card is clickable',
    onClick: () => alert('Clicked!'),
  },
};
