import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DataTable from './DataTable';

const mockColumns = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
];

function generateRows(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    role: i % 3 === 0 ? 'Admin' : i % 3 === 1 ? 'Editor' : 'Viewer',
    status: i % 2 === 0 ? 'Active' : 'Inactive',
  }));
}

describe('DataTable Load Tests', () => {
  it('renders 1000 rows within 300ms', () => {
    const start = performance.now();
    render(<DataTable data={generateRows(1000)} columns={mockColumns} />);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(300);
  });

  it('renders 5000 rows within 500ms', () => {
    const start = performance.now();
    render(<DataTable data={generateRows(5000)} columns={mockColumns} />);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(500);
  });

  it('renders 10000 rows within 1000ms', () => {
    const start = performance.now();
    render(<DataTable data={generateRows(10000)} columns={mockColumns} />);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(1000);
  });

  it('sorts 5000 rows by name in under 200ms', () => {
    render(<DataTable data={generateRows(5000)} columns={mockColumns} />);
    const nameHeader = screen.getByText('Name');
    const start = performance.now();
    fireEvent.click(nameHeader);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(200);
    const cells = screen.getAllByRole('cell');
    expect(cells.length).toBeGreaterThan(0);
  });

  it('paginates correctly with 5000 rows and page size 50', () => {
    render(
      <DataTable
        data={generateRows(5000)}
        columns={mockColumns}
        pageSize={50}
      />
    );
    expect(screen.getByText('User 0')).toBeTruthy();
    expect(screen.getByText('User 49')).toBeTruthy();
    expect(screen.queryByText('User 50')).toBeNull();
  });

  it('handles 50 columns without crashing', () => {
    const manyColumns = Array.from({ length: 50 }, (_, i) => ({
      key: `col${i}`,
      header: `Column ${i}`,
    }));
    const data10 = Array.from({ length: 10 }, (_, i) => {
      const row: Record<string, string | number> = { id: i };
      for (let c = 0; c < 50; c++) row[`col${c}`] = `val${i}_${c}`;
      return row;
    });
    const start = performance.now();
    render(<DataTable data={data10 as any} columns={manyColumns} />);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(300);
  });
});
