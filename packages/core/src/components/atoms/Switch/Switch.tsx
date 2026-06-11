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
  className?: string;
  id?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      label,
      description,
      size = 'default',
      id,
      disabled,
      style,
      checked,
      defaultChecked,
      onCheckedChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id ?? generatedId;

    return (
      <div className="control-field control-field--switch" style={style}>
        <PrimitiveSwitch.Root
          id={switchId}
          ref={ref}
          disabled={disabled}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
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
