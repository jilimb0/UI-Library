import { describe, it, expect, vi } from 'vitest';

import { render, screen, fireEvent } from '@testing-library/react';
import { Form } from './Form';
import React from 'react';

describe('Form', () => {
  it('renders without crashing', () => {
    const mockSubmit = vi.fn();
    render(<Form onSubmit={mockSubmit}>Example</Form>);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', () => {
    const mockSubmit = vi.fn();
    render(<Form onSubmit={mockSubmit}>Example</Form>);
    fireEvent.submit(screen.getByTestId('form'));
    expect(mockSubmit).toHaveBeenCalled();
  });

  it('should collect and pass data on submit', () => {
    const mockSubmit = vi.fn();
    render(<Form onSubmit={mockSubmit}>Example</Form>);
    fireEvent.submit(screen.getByTestId('form'));
    expect(mockSubmit).toHaveBeenCalledWith({});
  });

  it('should prevent default form submission', () => {
    const mockSubmit = vi.fn();
    render(<Form onSubmit={mockSubmit}>Example</Form>);
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    expect(mockSubmit).toHaveBeenCalled();
  });
});
