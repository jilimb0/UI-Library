import { type FormEvent, type FormHTMLAttributes, forwardRef } from 'react';

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (data: Record<string, any>) => void;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmit, children, ...props }, ref) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const data: Record<string, any> = Object.fromEntries(formData);

      onSubmit(data);
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        data-testid="form"
        aria-label="form"
        {...props}
      >
        {children}
      </form>
    );
  }
);
Form.displayName = 'Form';
