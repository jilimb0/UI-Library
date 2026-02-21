import type { Meta, StoryObj } from '@storybook/react';
import DataTable from './DataTable';

const meta: Meta<typeof DataTable> = {
  title: 'Components/Organisms/DataTable',
  component: DataTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof DataTable>;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const sampleData: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'User',
    status: 'Inactive',
  },
  {
    id: 4,
    name: 'Alice Williams',
    email: 'alice@example.com',
    role: 'Moderator',
    status: 'Active',
  },
  {
    id: 5,
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'User',
    status: 'Active',
  },
];

const columns = [
  {
    key: 'name',
    header: 'Name',
    sortable: true,
  },
  {
    key: 'email',
    header: 'Email',
    sortable: true,
  },
  {
    key: 'role',
    header: 'Role',
    sortable: true,
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (item: User) => (
      <span
        className={item.status === 'Active' ? 'text-green-600' : 'text-red-600'}
      >
        {item.status}
      </span>
    ),
  },
];

export const Default: Story = {
  args: {
    data: sampleData,
    columns,
    pageSize: 10,
  },
};

export const WithPagination: Story = {
  args: {
    data: sampleData,
    columns,
    pageSize: 2,
  },
};

export const WithCustomRender: Story = {
  args: {
    data: sampleData,
    columns: [
      {
        key: 'name',
        header: 'Name',
        sortable: true,
        render: (item: User) => (
          <div className="font-semibold text-blue-600">{item.name}</div>
        ),
      },
      {
        key: 'email',
        header: 'Email',
        sortable: true,
      },
      {
        key: 'role',
        header: 'Role',
        sortable: true,
        render: (item: User) => (
          <span className="px-2 py-1 bg-gray-100 rounded text-sm">
            {item.role}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (item: User) => (
          <span
            className={`px-2 py-1 rounded text-sm ${
              item.status === 'Active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {item.status}
          </span>
        ),
      },
    ],
    pageSize: 5,
  },
};

export const LargeDataset: Story = {
  args: {
    data: Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: ['Admin', 'User', 'Moderator'][i % 3],
      status: i % 4 === 0 ? 'Inactive' : 'Active',
    })),
    columns,
    pageSize: 10,
  },
};
