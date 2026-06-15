import { createSwitchBehavior } from '@ui-construction-library/behaviors';
import {
  type CSSProperties,
  forwardRef,
  type KeyboardEvent,
  useId,
} from 'react';
import { cn } from '../../../utils/cn';

export interface SwitchProps {
  label?: string;
  description?: string;
  size?: 'sm' | 'default' | 'md' | 'lg';
  className?: string;
  id?: string;
  disabled?: boolean;
  style?: CSSProperties;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** Native form name */
  name?: string;
  /** Native form value */
  value?: string;
  /** Native form association */
  form?: string;
  required?: boolean;
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
      onCheckedChange,
      name,
      value,
      form,
      required,
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id ?? generatedId;

    const { rootAttrs, rootClassName, thumbAttrs, thumbClassName } =
      createSwitchBehavior({
        checked,
        disabled,
        size,
        onCheckedChange,
      });

    const handleToggle = () => {
      if (!disabled) {
        onCheckedChange?.(!checked);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (
        event.key === ' ' ||
        event.key === 'Space' ||
        event.key === 'Spacebar' ||
        event.key === 'Enter'
      ) {
        event.preventDefault();
        handleToggle();
      }
    };

    return (
      <div
        className="ucl-control-field ucl-control-field--switch"
        style={style}
      >
        {/* Hidden native input for form submission and Constraint Validation */}
        <input
          type="checkbox"
          name={name}
          value={value}
          form={form}
          checked={checked}
          disabled={disabled}
          required={required}
          aria-hidden="true"
          tabIndex={-1}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            width: 1,
            height: 1,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: 0,
          }}
          onChange={() => {
            if (!disabled) {
              onCheckedChange?.(!checked);
            }
          }}
        />
        <button
          id={switchId}
          ref={ref}
          type="button"
          className={cn(rootClassName, className)}
          aria-disabled={disabled || undefined}
          {...rootAttrs}
          onKeyDown={handleKeyDown}
          onClick={handleToggle}
        >
          <span {...thumbAttrs} className={thumbClassName} />
        </button>

        {(label || description) && (
          <label
            htmlFor={switchId}
            className="ucl-control-stack ucl-field-label"
          >
            {label}
            {description ? (
              <span className="ucl-field-hint">{description}</span>
            ) : null}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
