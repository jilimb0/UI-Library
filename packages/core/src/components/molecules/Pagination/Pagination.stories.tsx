import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Molecules/Pagination',
  component: Pagination,
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
