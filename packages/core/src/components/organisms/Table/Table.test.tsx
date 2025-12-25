
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Table } from './Table';

expect.extend(toHaveNoViolations);

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
    expect(results).toHaveNoViolations();
  });
});
