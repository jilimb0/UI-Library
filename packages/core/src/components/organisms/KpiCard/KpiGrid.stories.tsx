import type { Meta, StoryObj } from '@storybook/react-vite';
import { KpiCard } from './KpiCard';
import { KpiGrid } from './KpiGrid';

const meta: Meta<typeof KpiGrid> = {
  title: 'Components/Organisms/KpiGrid',
  component: KpiGrid,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KpiGrid>;

export const Default: Story = {
  render: () => (
    <KpiGrid>
      <KpiCard label="Revenue" value="$45k" subtext="+20%" />
      <KpiCard label="Users" value="2.8k" subtext="+12%" />
      <KpiCard
        label="Conversion"
        value="3.2%"
        subtext="+0.5%"
        variant="success"
      />
      <KpiCard label="Bounce" value="42%" subtext="-5%" variant="warning" />
    </KpiGrid>
  ),
};

export const ThreeColumns: Story = {
  render: () => (
    <KpiGrid columns={3}>
      <KpiCard label="Metric A" value="100" />
      <KpiCard label="Metric B" value="200" />
      <KpiCard label="Metric C" value="300" />
    </KpiGrid>
  ),
};
