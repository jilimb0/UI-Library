import { Table } from '@ui/core';

const data = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 2, name: 'Jane Smith', age: 25 },
  { id: 3, name: 'Sam Johnson', age: 35 },
];

export function TablesPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Tables Examples</h2>
      <Table data={data} columns={['id', 'name', 'age']} />
    </div>
  );
}
