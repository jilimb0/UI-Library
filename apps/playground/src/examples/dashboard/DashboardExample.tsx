
import React from 'react';
import { Card, Table, Button } from '@ui/core';

const data = [
  { id: 1, name: 'Product A', price: 100 },
  { id: 2, name: 'Product B', price: 200 },
];

export function DashboardExample() {
  return (
    <Card>
      <h2>Dashboard</h2>
      <Table data={data} columns={['id', 'name', 'price']} />
      <Button onClick={() => alert('View details clicked')}>View Details</Button>
    </Card>
  );
}
