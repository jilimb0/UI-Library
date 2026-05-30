import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
      return (
        <Pagination
          page={page}
          totalPages={10}
          pageSize={20}
          onPageSizeChange={() => {}}
          onPageChange={setPage}
        />
      );
    };
    return <Demo />;
  },
};
