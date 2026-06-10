import type { ReactNode } from 'react';
import {
  type Control,
  type FieldValues,
  type SubmitHandler,
  useFormContext,
} from 'react-hook-form';

export type FormActionsProps<T extends FieldValues> = {
  /** Submit handler — receives validated form values. */
  onSubmit: SubmitHandler<T>;
  /** Label for the submit button. Defaults to "Submit". */
  submitLabel?: string;
  /** Label for the reset button. Defaults to "Reset". */
  resetLabel?: string;
  /** Whether to show a reset button alongside submit. */
  showReset?: boolean;
  /** Content rendered between the reset and submit buttons (e.g. cancel link). */
  secondary?: ReactNode;
  /** Whether the form is currently submitting (overrides internal isSubmitting). */
  loading?: boolean;
  /** Whether to disable buttons when the form has no dirty fields. */
  disableWhenPristine?: boolean;
  /** Optional control — falls back to FormProvider context. */
  control?: Control<T>;
};

/**
 * Render-less submit/reset bar wired to react-hook-form's form state.
 *
 * Must be rendered inside a `<FormProvider>` (or pass `control` explicitly).
 *
 * @example
 * ```tsx
 * <FormProvider {...methods}>
 *   <form onSubmit={methods.handleSubmit(onSave)}>
 *     <FormField name="title" control={methods.control} label="Title" />
 *     <FormActions onSubmit={onSave} submitLabel="Save" showReset />
 *   </form>
 * </FormProvider>
 * ```
 */
export function FormActions<T extends FieldValues>({
  onSubmit,
  submitLabel = 'Submit',
  resetLabel = 'Reset',
  showReset = false,
  secondary,
  loading,
  disableWhenPristine = false,
}: FormActionsProps<T>) {
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useFormContext<T>();

  const isLoading = loading ?? isSubmitting;
  const shouldDisable = disableWhenPristine && !isDirty;

  return (
    <div
      data-form-actions=""
      style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
    >
      {secondary}
      {showReset && (
        <button
          type="button"
          onClick={() => reset()}
          disabled={isLoading || shouldDisable}
          data-form-actions-reset=""
        >
          {resetLabel}
        </button>
      )}
      <button
        type="submit"
        onClick={handleSubmit(onSubmit)}
        disabled={isLoading || shouldDisable}
        data-form-actions-submit=""
        aria-busy={isLoading}
      >
        {isLoading ? 'Submitting…' : submitLabel}
      </button>
    </div>
  );
}
