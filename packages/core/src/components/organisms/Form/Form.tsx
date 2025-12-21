
import * as React from 'react';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (data: Record<string, any>) => void;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(({ onSubmit, children, ...props }, ref) => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: collect data and validate before calling onSubmit
    onSubmit({});
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  );
});
Form.displayName = 'Form';
