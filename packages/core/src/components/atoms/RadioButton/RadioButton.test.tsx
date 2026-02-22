import { render, screen } from '@testing-library/react';
import { RadioButton } from './RadioButton';

describe('RadioButton', () => {
  it('renders label', () => {
    render(<RadioButton label="Option" name="group" />);
    expect(screen.getByLabelText('Option')).toBeInTheDocument();
  });
});
