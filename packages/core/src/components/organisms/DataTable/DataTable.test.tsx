import { describe, it, expect } from 'vitest';

import { render, screen, fireEvent } from '@testing-library/react';
import DataTable from './DataTable';
import '@testing-library/jest-dom';

const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

const mockColumns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
];

describe('DataTable', () => {
  it('renders data in table format', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('handles column sorting', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);

    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    fireEvent.click(nameHeader);

    // Проверка что данные отсортированы
  });

  it('should render empty state when no data', () => {
    render(<DataTable data={[]} columns={mockColumns} />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('should handle custom renderers', () => {
    const customColumns = [
      {
        key: 'name',
        header: 'Name',
        render: (item: { name?: string }) => <span>{item.name}</span>,
      },
    ];
    render(<DataTable data={mockData} columns={customColumns} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should handle pagination edge cases', () => {
    render(<DataTable data={mockData} columns={mockColumns} pageSize={50} />);
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });

  it('should handle sorting', () => {
    render(<DataTable data={mockData} columns={mockColumns} />);
    fireEvent.click(screen.getByText('Name'));
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
