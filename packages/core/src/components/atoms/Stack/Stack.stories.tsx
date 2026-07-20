import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  title: 'Components/Atoms/Stack',
  component: Stack,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stack>;

function Box({ children }: { children: string }) {
  return (
    <div
      style={{
        padding: '1rem',
        background: 'var(--muted)',
        borderRadius: 'var(--radius)',
      }}
    >
      {children}
    </div>
  );
}

export const Vertical: Story = {
  render: () => (
    <Stack>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack direction="horizontal">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Stack>
  ),
};

export const WithCustomGap: Story = {
  render: () => (
    <Stack gap="2rem">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
    </Stack>
  ),
};

export const Centered: Story = {
  render: () => (
    <Stack
      align="center"
      justify="center"
      style={{ height: '10rem', border: '1px dashed var(--border)' }}
    >
      <Box>Centered</Box>
    </Stack>
  ),
};
