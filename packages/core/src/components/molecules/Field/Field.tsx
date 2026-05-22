import {
  Children,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
} from 'react';
import { cn } from '../../../utils/cn';

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode;
  error?: ReactNode;
  description?: ReactNode;
}

function labelControl(children: ReactNode, fallbackId: string) {
  const childList = Children.toArray(children);
  if (childList.length !== 1 || !isValidElement(childList[0])) {
    return { control: children, labelFor: undefined as string | undefined };
  }

  const child = childList[0] as ReactElement<{ id?: string }>;
  const controlId = child.props.id ?? fallbackId;

  return {
    control: cloneElement(child, { id: controlId }),
    labelFor: controlId,
  };
}

const Field = forwardRef<HTMLDivElement, FieldProps>(
  ({ label, error, description, className, children, ...props }, ref) => {
    const inputId = useId();
    const { control, labelFor } = labelControl(children, inputId);

    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1', className)}
        {...props}
      >
        {label && (
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor={labelFor}
          >
            {label}
          </label>
        )}
        {control}
        {description && <p className="text-xs text-gray-500">{description}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Field.displayName = 'Field';

export { Field };
