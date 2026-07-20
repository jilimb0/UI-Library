import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { FloatingLabelInput } from './FloatingLabelInput';

describe('FloatingLabelInput', () => {
  it('renders label', () => {
    render(<FloatingLabelInput label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders input with correct id linked to label', () => {
    render(<FloatingLabelInput label="Name" id="name" />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<FloatingLabelInput label="Email" error="Required" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Required');
  });

  it('shows hint text', () => {
    render(<FloatingLabelInput label="Email" hint="Enter your email" />);
    expect(screen.getByText('Enter your email')).toBeInTheDocument();
  });

  it('prioritizes error over hint', () => {
    render(<FloatingLabelInput label="Email" error="Error" hint="Hint" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
  });

  it('floats label when value is provided', () => {
    render(<FloatingLabelInput label="Name" value="John" readOnly />);
    const label = screen.getByText('Name');
    expect(label.className).toContain('label--float');
  });

  it('floats label on focus', async () => {
    const user = userEvent.setup();
    render(<FloatingLabelInput label="Name" />);
    const input = screen.getByLabelText('Name');
    await user.click(input);
    const label = screen.getByText('Name');
    expect(label.className).toContain('label--float');
  });

  it('forwards ref', () => {
    const ref = { current: null };
    render(<FloatingLabelInput label="Test" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
