
import * as React from 'react';
import { cn } from '../../../utils/cn';

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  error?: React.ReactNode;
  description?: React.ReactNode;
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ label, error, description, className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex flex-col space-y-1', className)} {...props}>
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        {children}
        {description && <p className="text-xs text-gray-500">{description}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Field.displayName = 'Field';

export { Field };
