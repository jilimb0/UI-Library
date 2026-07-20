import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageTip } from './PageTip';

const meta: Meta<typeof PageTip> = {
  title: 'Components/Molecules/PageTip',
  component: PageTip,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageTip>;

export const Default: Story = {
  args: {
    id: 'default',
    children: 'You can filter results by date range.',
  },
};

export const WithIcon: Story = {
  args: {
    id: 'with-icon',
    children: 'Your data is updated in real time.',
  },
};
