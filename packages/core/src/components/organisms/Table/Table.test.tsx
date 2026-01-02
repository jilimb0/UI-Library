import { describe, it, expect, vi } from "vitest";

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Table } from './Table';
import React from 'react';


describe('Table component', () => {
  it('renders without crashing', () => {
    render(
      <Table>
        <tbody>
          <tr>
            <td>Example</td>
          </tr>
        </tbody>
      </Table>
    );
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <Table>
        <tbody>
          <tr>
            <td>Example</td>
          </tr>
        </tbody>
      </Table>
    );
    const results = await axe(container);
  });
});
