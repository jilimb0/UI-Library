import { createCheckboxBehavior } from '@ui-construction-library/behaviors';
import { CheckIcon } from '@ui-construction-library/icons';
import {
  type ChangeEvent,
  forwardRef,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  useEffect,
  useId,
  useRef,
} from 'react';
import { cn } from '../../../utils/cn';

export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLButtonElement>,
    'type' | 'size' | 'checked' | 'onChange'
  > {
  label?: string;
  description?: string;
  error?: boolean;
  errorMessage?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'default' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Native form name */
  name?: string;
  /** Native form value */
  value?: string;
  /** Native form association */
  form?: string;
}

/**
 * Accessible checkbox component with label, description, indeterminate state, and error handling.
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Accept terms"
 *   checked={agreed}
 *   onCheckedChange={setAgreed}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Checkbox
 *   label="Select all"
 *   indeterminate={someSelected}
 *   checked={allSelected}
 *   onCheckedChange={handleSelectAll}
 * />
 * ```
 */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      error,
      errorMessage,
      size = 'default',
      indeterminate,
      checked,
      onCheckedChange,
      onChange,
      id,
      name,
      value,
      form,
      ...props
    },
    ref
  ) => {
    const uid = useId();
    const checkboxId = id ?? `checkbox-${uid}`;
    const labelId = `${checkboxId}-label`;
    const descriptionId = `${checkboxId}-description`;
    const errorId = `${checkboxId}-error`;
    const hiddenInputRef = useRef<HTMLInputElement>(null);

    const handleCheckedChange = (
      nextChecked: boolean,
      event?:
        | ChangeEvent<HTMLInputElement>
        | KeyboardEvent<HTMLButtonElement>
        | MouseEvent<HTMLButtonElement>
    ) => {
      onCheckedChange?.(nextChecked);

      if (onChange) {
        const changeEvent =
          event && 'target' in event
            ? event
            : ({
                target: { checked: nextChecked },
              } as ChangeEvent<HTMLInputElement>);
        onChange(changeEvent as ChangeEvent<HTMLInputElement>);
      }
    };

    const { checkboxAttrs, checkboxClassName, handlers } =
      createCheckboxBehavior({
        checked,
        indeterminate,
        disabled: props.disabled,
        onCheckedChange,
        id: checkboxId,
        labelId: label ? labelId : undefined,
        descriptionId: description ? descriptionId : undefined,
        errorId: error && errorMessage ? errorId : undefined,
        hasError: error,
      });

    useEffect(() => {
      if (hiddenInputRef.current) {
        hiddenInputRef.current.indeterminate = indeterminate ?? false;
      }
    }, [indeterminate]);

    return (
      <div className="ucl-control-field">
        <div style={{ position: 'relative' }}>
          {/* Hidden native input for form submission and Constraint Validation */}
          <input
            ref={hiddenInputRef}
            type="checkbox"
            name={name}
            value={value}
            form={form}
            checked={checked}
            disabled={props.disabled}
            required={props.required}
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
            onChange={(event) => {
              if (!props.disabled) {
                handleCheckedChange(!checked, event);
              }
            }}
          />
          <button
            type="button"
            ref={ref}
            {...checkboxAttrs}
            {...handlers}
            aria-label={label ?? props['aria-label']}
            className={cn(
              checkboxClassName,
              {
                'checkbox-box': true,
                'checkbox-box--sm': size === 'sm',
                'checkbox-box--lg': size === 'lg',
              },
              className
            )}
            onKeyDown={(event) => {
              if (
                event.key === ' ' ||
                event.key === 'Space' ||
                event.key === 'Spacebar'
              ) {
                event.preventDefault();
                handleCheckedChange(!checked, event);
              }
            }}
            onClick={(event) => handleCheckedChange(!checked, event)}
            {...props}
          />

          <CheckIcon
            width={size === 'sm' ? 12 : size === 'lg' ? 20 : 16}
            height={size === 'sm' ? 12 : size === 'lg' ? 20 : 16}
            preserveAspectRatio="xMidYMid meet"
          />
        </div>

        {(label || description || (error && errorMessage)) && (
          <div className="ucl-control-stack">
            {label ? (
              <label
                htmlFor={checkboxId}
                id={labelId}
                className="ucl-field-label"
              >
                {label}
              </label>
            ) : null}
            {description ? (
              <p id={descriptionId} className="ucl-field-hint">
                {description}
              </p>
            ) : null}
            {error && errorMessage ? (
              <p id={errorId} className="ucl-field-error" aria-live="polite">
                {errorMessage}
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
