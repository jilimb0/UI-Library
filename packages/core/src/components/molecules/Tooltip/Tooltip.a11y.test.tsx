import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Tooltip Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Tooltip content="Helpful hint">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('trigger has aria-describedby linking to tooltip', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-describedby');
    const tooltipId = trigger.getAttribute('aria-describedby');
    expect(document.getElementById(tooltipId!)).toHaveAttribute(
      'role',
      'tooltip'
    );
  });

  it('tooltip has role tooltip', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Hover me</button>
      </Tooltip>
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful hint');
  });
});
