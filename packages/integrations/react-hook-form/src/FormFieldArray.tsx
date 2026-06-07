import type { ReactNode } from 'react';
import {
  type ArrayPath,
  type Control,
  type FieldArray,
  type FieldValues,
  useFieldArray,
} from 'react-hook-form';

export type FormFieldArrayProps<T extends FieldValues> = {
  name: ArrayPath<T>;
  control: Control<T>;
  /** Render function for each item in the array. */
  render: (item: { index: number; remove: () => void }) => ReactNode;
  /** Label for the "add" button. */
  addLabel?: string;
  /** Default value for a new item appended to the array. */
  defaultItem?: FieldArray<T, ArrayPath<T>>;
};

/**
 * Dynamic list field bound to react-hook-form's `useFieldArray`.
 *
 * @example
 * ```tsx
 * <FormFieldArray
 *   name="emails"
 *   control={control}
 *   defaultItem=""
 *   addLabel="Add email"
 *   render={({ index, remove }) => (
 *     <div>
 *       <FormField name={`emails.${index}`} control={control} />
 *       <button onClick={remove}>Remove</button>
 *     </div>
 *   )}
 * />
 * ```
 */
export function FormFieldArray<T extends FieldValues>({
  name,
  control,
  render,
  addLabel = 'Add item',
  defaultItem,
}: FormFieldArrayProps<T>) {
  const { fields, append, remove } = useFieldArray({
    name: name as ArrayPath<T>,
    control,
  });

  return (
    <div data-field-array="">
      {fields.map((field, index) => (
        <div key={field.id} data-field-array-item="">
          {render({ index, remove: () => remove(index) })}
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          if (defaultItem !== undefined) {
            append(defaultItem);
          } else {
            append({} as FieldArray<T, ArrayPath<T>>);
          }
        }}
        data-field-array-add=""
      >
        {addLabel}
      </button>
    </div>
  );
}
