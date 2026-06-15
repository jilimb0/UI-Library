/**
 * Field behavior — framework-agnostic form field ARIA wiring + className.
 */

export interface FieldBehaviorOptions {
  fieldId: string;
  descriptionId?: string;
  errorId?: string;
  hasError?: boolean;
  disabled?: boolean;
  required?: boolean;
}

export function createFieldBehavior(opts: FieldBehaviorOptions) {
  const describedByParts = [
    opts.descriptionId,
    opts.hasError ? opts.errorId : null,
  ].filter(Boolean);

  return {
    fieldAttrs: {
      'data-field': '',
      'data-error': opts.hasError || undefined,
      'data-disabled': opts.disabled || undefined,
    },
    fieldClassName: 'ucl-field',
    labelAttrs: {
      htmlFor: opts.fieldId,
    },
    labelClassName: 'ucl-field-label',
    inputAttrs: {
      id: opts.fieldId,
      disabled: opts.disabled,
      required: opts.required,
      'aria-invalid': opts.hasError || undefined,
      'aria-describedby':
        describedByParts.length > 0 ? describedByParts.join(' ') : undefined,
      'data-error': opts.hasError || undefined,
    },
    inputClassName: `ucl-input ${opts.hasError ? 'ucl-input--error' : ''}`,
    hintAttrs: {
      id: opts.descriptionId,
    },
    hintClassName: 'ucl-field-hint',
    errorAttrs: {
      id: opts.errorId,
      'aria-live': 'polite' as const,
    },
    errorClassName: 'ucl-field-error',
  };
}
