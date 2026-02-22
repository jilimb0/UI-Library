import { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '../../../utils/cn';

export interface RadioButtonProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: string;
  description?: string;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ className, label, description, ...props }, ref) => {
    const id = useId();
    return (
      <div className="flex items-start gap-2">
        <input
          id={id}
          ref={ref}
          type="radio"
          className={cn(
            'mt-1 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-600',
            className
          )}
          {...props}
        />
        {(label || description) && (
          <label htmlFor={id} className="cursor-pointer">
            {label && (
              <div className="text-sm font-medium text-slate-900">{label}</div>
            )}
            {description && (
              <div className="text-sm text-slate-600">{description}</div>
            )}
          </label>
        )}
      </div>
    );
  }
);

RadioButton.displayName = 'RadioButton';
