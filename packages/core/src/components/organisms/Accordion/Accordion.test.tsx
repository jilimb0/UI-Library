import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Accordion } from './Accordion';
import '@testing-library/jest-dom';

describe('Accordion', () => {
  it('should open and close items', () => {
    render(
      <Accordion type="single" collapsible data-testid="accordion">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Item 1</Accordion.Trigger>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>Item 2</Accordion.Trigger>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );
    const trigger = screen.getByText('Item 1');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'open');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'closed');
  });

  it('should close other items when multiple is not set', () => {
    render(
      <Accordion type="single" collapsible data-testid="accordion">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>Item 1</Accordion.Trigger>
          <Accordion.Content>Content 1</Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>Item 2</Accordion.Trigger>
          <Accordion.Content>Content 2</Accordion.Content>
        </Accordion.Item>
      </Accordion>
    );
    fireEvent.click(screen.getByText('Item 1'));
    fireEvent.click(screen.getByText('Item 2'));
    expect(screen.getByText('Item 1')).toHaveAttribute('data-state', 'closed');
    expect(screen.getByText('Item 2')).toHaveAttribute('data-state', 'open');
  });

  it('should handle no items', () => {
    render(
      <Accordion type="single" collapsible>
        <div />
      </Accordion>
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should support custom props like className', () => {
    render(
      <Accordion
        type="single"
        collapsible
        className="custom-class"
        data-testid="accordion"
      >
        <div />
      </Accordion>
    );
    expect(screen.getByTestId('accordion')).toHaveClass('custom-class');
  });
});
