# React Hook Form Integration

**Package:** `@ui-construction-library/react-hook-form`

## Install

```bash
pnpm add @ui-construction-library/react-hook-form react-hook-form
```

## Components

### FormField

Controlled input wired to `useController` with label, description, and error display.

```tsx
<FormField name="email" control={control} label="Email" placeholder="you@example.com" />
```

### FormFieldArray

Dynamic list field backed by `useFieldArray` with add/remove support.

```tsx
<FormFieldArray
  name="emails"
  control={control}
  defaultItem=""
  addLabel="Add email"
  render={({ index, remove }) => (
    <div>
      <FormField name={`emails.${index}`} control={control} />
      <button onClick={remove}>Remove</button>
    </div>
  )}
/>
```

### FormActions

Submit/reset button bar with loading and pristine-aware disable.

```tsx
<FormProvider {...methods}>
  <form>
    <FormField name="title" control={methods.control} label="Title" />
    <FormActions onSubmit={handleSave} submitLabel="Save" showReset disableWhenPristine />
  </form>
</FormProvider>
```

## Usage pattern

1. Create a form with `useForm<T>()` from react-hook-form.
2. Wrap with `<FormProvider>` so `FormActions` can access form state.
3. Use `FormField` for individual inputs, `FormFieldArray` for dynamic lists.
4. Use `FormActions` for the submit bar.

```tsx
import { useForm, FormProvider } from 'react-hook-form';
import { FormField, FormFieldArray, FormActions } from '@ui-construction-library/react-hook-form';

type SettingsForm = { name: string; tags: string[] };

function Settings() {
  const methods = useForm<SettingsForm>({ defaultValues: { name: '', tags: [] } });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((data) => console.log(data))}>
        <FormField name="name" control={methods.control} label="Name" />
        <FormFieldArray name="tags" control={methods.control} addLabel="Add tag" render={...} />
        <FormActions onSubmit={methods.handleSubmit(save)} />
      </form>
    </FormProvider>
  );
}
```
