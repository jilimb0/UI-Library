import { type FormEvent, type FormHTMLAttributes, forwardRef } from 'react';

export type FormSubmitData = Record<string, FormDataEntryValue>;

export interface FormProps
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: FormSubmitData) => void;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmit, children, style, ...props }, ref) => {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData) as FormSubmitData;

      onSubmit(data);
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className="form-stack"
        style={style}
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
