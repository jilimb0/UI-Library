import { forwardRef, type InputHTMLAttributes, useId } from 'react';
import { cn } from '../../../utils/cn';

export interface RadioButtonProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ className, label, description, ...props }, ref) => {
    const id = useId();
    return (
      <div className="control-field">
        <input
          id={id}
          ref={ref}
          type="radio"
          className={cn('radio-input', className)}
          {...props}
        />
        {(label || description) && (
          <label htmlFor={id} className="control-stack">
            {label ? <span className="field-label">{label}</span> : null}
            {description ? (
              <span className="field-hint">{description}</span>
            ) : null}
          </label>
        )}
      </div>
    );
  }
);

RadioButton.displayName = 'RadioButton';
