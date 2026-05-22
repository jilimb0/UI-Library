import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Switch } from './switch';

describe('Switch a11y contract', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Switch.Root aria-label="Notifications">
        <Switch.Thumb />
      </Switch.Root>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('toggles on click', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(
      <Switch.Root aria-label="Notifications" defaultChecked={false}>
        <Switch.Thumb />
      </Switch.Root>
    );
    const control = getByRole('switch', { name: 'Notifications' });
    expect(control.getAttribute('aria-checked')).toBe('false');
    await user.click(control);
    expect(control.getAttribute('aria-checked')).toBe('true');
  });
});
