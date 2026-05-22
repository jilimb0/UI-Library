import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Tabs } from './tabs';

describe('Tabs a11y contract', () => {
  it('has no axe violations', async () => {
    const { container } = render(
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Panel one</Tabs.Content>
        <Tabs.Content value="two">Panel two</Tabs.Content>
      </Tabs.Root>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('switches panels on trigger click', async () => {
    const user = userEvent.setup();
    const { getByRole, getByText } = render(
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">One</Tabs.Trigger>
          <Tabs.Trigger value="two">Two</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="one">Panel one</Tabs.Content>
        <Tabs.Content value="two">Panel two</Tabs.Content>
      </Tabs.Root>
    );
    await user.click(getByRole('tab', { name: 'Two' }));
    expect(getByText('Panel two')).toBeTruthy();
  });
});
