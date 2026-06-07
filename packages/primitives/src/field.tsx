import {
  type ButtonHTMLAttributes,
  createContext,
  forwardRef,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  useContext,
  useId,
} from 'react';

// ---------------------------------------------------------------------------
// Field — form field wrapper providing context (label, description, error)
// ---------------------------------------------------------------------------

type FieldContextValue = {
  fieldId: string;
  descriptionId: string;
  errorId: string;
  hasError: boolean;
  disabled: boolean;
  required: boolean;
};

const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  return useContext(FieldContext);
}

export type FieldProps = HTMLAttributes<HTMLDivElement> & {
  /** Unique ID for the field. Auto-generated if not provided. */
  id?: string;
  /** Whether the field has a validation error. */
  error?: boolean;
  /** Whether the field is disabled. */
  disabled?: boolean;
  /** Whether the field is required. */
  required?: boolean;
};

export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    id: idProp,
    error = false,
    disabled = false,
    required = false,
    children,
    ...props
  },
  ref
) {
  const autoId = useId();
  const fieldId = idProp ?? autoId;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  return (
    <FieldContext.Provider
      value={{
        fieldId,
        descriptionId,
        errorId,
        hasError: error,
        disabled,
        required,
      }}
    >
      <div
        ref={ref}
        data-field=""
        data-error={error || undefined}
        data-disabled={disabled || undefined}
        {...props}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
});

// ---------------------------------------------------------------------------
// Label — accessible label with optional required indicator
// ---------------------------------------------------------------------------

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  /** Whether to show a required indicator. Defaults to the Field's required state. */
  required?: boolean;
};

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { required: requiredProp, children, htmlFor, ...props },
  ref
) {
  const ctx = useFieldContext();
  const isRequired = requiredProp ?? ctx?.required ?? false;
  const target = htmlFor ?? ctx?.fieldId;

  return (
    <label
      ref={ref}
      htmlFor={target}
      data-required={isRequired || undefined}
      {...props}
    >
      {children}
      {isRequired && (
        <span aria-hidden="true" data-required-indicator="">
          {' *'}
        </span>
      )}
    </label>
  );
});

// ---------------------------------------------------------------------------
// InputBase — headless input with ARIA wiring to Field context
// ---------------------------------------------------------------------------

export type InputBaseProps = InputHTMLAttributes<HTMLInputElement>;

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>(
  function InputBase(
    { id, 'aria-describedby': ariaDescribedBy, ...props },
    ref
  ) {
    const ctx = useFieldContext();
    const resolvedId = id ?? ctx?.fieldId;

    const describedByParts = [
      ariaDescribedBy,
      ctx?.hasError ? ctx.errorId : null,
    ].filter(Boolean);

    return (
      <input
        ref={ref}
        id={resolvedId}
        disabled={ctx?.disabled}
        required={ctx?.required}
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={
          describedByParts.length > 0 ? describedByParts.join(' ') : undefined
        }
        data-error={ctx?.hasError || undefined}
        {...props}
      />
    );
  }
);

// ---------------------------------------------------------------------------
// SelectBase — headless select trigger with ARIA wiring to Field context
// ---------------------------------------------------------------------------

export type SelectBaseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Whether the select is currently open. */
  open?: boolean;
};

export const SelectBase = forwardRef<HTMLButtonElement, SelectBaseProps>(
  function SelectBase(
    { id, open, 'aria-describedby': ariaDescribedBy, children, ...props },
    ref
  ) {
    const ctx = useFieldContext();
    const resolvedId = id ?? ctx?.fieldId;

    const describedByParts = [
      ariaDescribedBy,
      ctx?.hasError ? ctx.errorId : null,
    ].filter(Boolean);

    return (
      <button
        ref={ref}
        id={resolvedId}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={ctx?.disabled}
        aria-invalid={ctx?.hasError || undefined}
        aria-describedby={
          describedByParts.length > 0 ? describedByParts.join(' ') : undefined
        }
        data-state={open ? 'open' : 'closed'}
        data-error={ctx?.hasError || undefined}
        {...props}
      >
        {children}
      </button>
    );
  }
);
