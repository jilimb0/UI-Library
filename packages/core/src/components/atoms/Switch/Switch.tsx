import type { SwitchProps as PrimitiveSwitchProps } from '@ui-construction-library/primitives';
import { forwardRef, useId } from 'react';
import { RadixSwitch } from '../../../adapters/radix';
import { cn } from '../../../utils/cn';

export interface SwitchProps extends PrimitiveSwitchProps {
  label?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { className, label, description, size = 'md', id, disabled, ...props },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id ?? generatedId;

    return (
      <div className="inline-flex items-start gap-3">
        <RadixSwitch.Root
          id={switchId}
          ref={ref}
          disabled={disabled}
          className={cn(
            'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-slate-300',
            {
              'h-4 w-7': size === 'sm',
              'h-5 w-9': size === 'md',
              'h-6 w-11': size === 'lg',
            },
            className
          )}
          {...props}
        >
          <RadixSwitch.Thumb
            className={cn(
              'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[100%] data-[state=unchecked]:translate-x-0',
              {
                'h-3 w-3': size === 'sm',
                'h-4 w-4': size === 'md',
                'h-5 w-5': size === 'lg',
              }
            )}
          />
        </RadixSwitch.Root>

        {(label || description) && (
          <label htmlFor={switchId} className="cursor-pointer select-none">
            {label && (
              <div className="text-sm font-medium text-slate-900">{label}</div>
            )}
            {description && (
              <div className="text-xs text-slate-500">{description}</div>
            )}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
