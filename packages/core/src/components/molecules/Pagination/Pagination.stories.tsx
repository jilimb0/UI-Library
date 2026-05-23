import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Molecules/Pagination',
  component: Pagination,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [page, setPage] = useState(3);
      const [size, setSize] = useState(20);
      return (
        <Pagination
          page={page}
          totalPages={12}
          onPageChange={setPage}
          pageSize={size}
          onPageSizeChange={setSize}
        />
      );
    };
    return <Demo />;
  },
};

export const Interaction: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Next' }));
    await expect(canvas.getByText('Page 4 of 12')).toBeInTheDocument();
  },
};
