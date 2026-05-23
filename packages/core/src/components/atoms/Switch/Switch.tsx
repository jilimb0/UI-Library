import {
  Switch as PrimitiveSwitch,
  type SwitchProps as PrimitiveSwitchProps,
} from '@ui-construction-library/primitives';
import { forwardRef, useId } from 'react';
import { cn } from '../../../utils/cn';

export interface SwitchProps extends PrimitiveSwitchProps {
  label?: string;
  description?: string;
  size?: 'sm' | 'default' | 'md' | 'lg';
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { className, label, description, size = 'default', id, disabled, ...props },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id ?? generatedId;

    return (
      <div className="control-field control-field--switch">
        <PrimitiveSwitch.Root
          id={switchId}
          ref={ref}
          disabled={disabled}
          className={cn(
            'switch',
            {
              'switch--sm': size === 'sm',
              'switch--md': size === 'default' || size === 'md',
              'switch--lg': size === 'lg',
            },
            className
          )}
          {...props}
        >
          <PrimitiveSwitch.Thumb className="switch-thumb" />
        </PrimitiveSwitch.Root>

        {(label || description) && (
          <label htmlFor={switchId} className="control-stack">
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

Switch.displayName = 'Switch';
