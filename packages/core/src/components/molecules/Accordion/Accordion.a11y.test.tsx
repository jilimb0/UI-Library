import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './Accordion';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';

describe('Accordion Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Trigger A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('trigger has aria-expanded false by default', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Trigger A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = screen.getByRole('button', { name: 'Trigger A' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('trigger toggles aria-expanded on click', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Trigger A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    const trigger = screen.getByRole('button', { name: 'Trigger A' });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('content is hidden when collapsed', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Trigger A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('content is visible when expanded', async () => {
    const user = userEvent.setup();
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>Trigger A</AccordionTrigger>
          <AccordionContent>Content A</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
    await user.click(screen.getByRole('button', { name: 'Trigger A' }));
    expect(screen.getByRole('region')).toBeInTheDocument();
  });
});
