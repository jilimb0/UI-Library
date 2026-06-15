import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Popover } from './Popover';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Popover Accessibility', () => {
  it('has no accessibility violations when closed', async () => {
    const { container } = render(
      <Popover
        trigger={<button type="button">Open</button>}
        content={<div>Content</div>}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('trigger has aria-expanded when open', () => {
    render(
      <Popover
        trigger={<button type="button">Open</button>}
        content={<div>Content</div>}
        open
      />
    );
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('content has role dialog', async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button type="button">Open</button>}
        content={<div>Content</div>}
      />
    );
    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
