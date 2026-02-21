import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';

const meta: Meta<typeof Table> = {
  title: 'Components/Organisms/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  args: {
    children: (
      <>
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              John Doe
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              john@example.com
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              Admin
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              Jane Smith
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              jane@example.com
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              User
            </td>
          </tr>
        </tbody>
      </>
    ),
  },
};
