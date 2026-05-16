import { Button, Card, Table } from '@ui-construction-library/core';

const data = [
  { id: 1, name: 'Product A', price: 100 },
  { id: 2, name: 'Product B', price: 200 },
];

export function DashboardExample() {
  return (
    <Card>
      <h2>Dashboard</h2>
      <Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button onClick={() => alert('View details clicked')}>
        View Details
      </Button>
    </Card>
  );
}
