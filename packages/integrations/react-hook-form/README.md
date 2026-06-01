# @ui-construction-library/react-hook-form

Form adapter layer for the UI Construction Library. Provides typed bindings between `@ui-construction-library/core` form components and `react-hook-form`.

## When to use

Use this package when your project uses `react-hook-form` and you want core form components (Input, Select, TextArea, Checkbox) wired to RHF's `register`, `control`, and validation system without boilerplate.

## Installation

```bash
pnpm add @ui-construction-library/react-hook-form react-hook-form
```

## Peer dependencies

```json
{
  "react": ">=18.0.0",
  "react-dom": ">=18.0.0",
  "react-hook-form": ">=7.0.0"
}
```

## Minimal example

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormField, FormInput, FormSelect } from '@ui-construction-library/react-hook-form';
import { Button } from '@ui-construction-library/core';

const schema = z.object({
  email: z.string().email('Enter a valid email address.'),
  role: z.enum(['editor', 'commenter', 'viewer']),
});

type FormValues = z.infer<typeof schema>;

export function InviteForm({ onSubmit }: { onSubmit: (data: FormValues) => void }) {
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} style={{ display: 'grid', gap: '1rem' }}>
      <FormField form={form} name="email">
        <FormInput label="Email" type="email" placeholder="user@example.com" />
      </FormField>

      <FormField form={form} name="role">
        <FormSelect
          label="Role"
          options={[
            { value: 'editor', label: 'Editor' },
            { value: 'commenter', label: 'Commenter' },
            { value: 'viewer', label: 'Viewer' },
          ]}
        />
      </FormField>

      <Button type="submit" loading={form.formState.isSubmitting}>
        Send invite
      </Button>
    </form>
  );
}
```

## Field-level error rendering

Errors from `react-hook-form` are automatically passed to the `description` prop of the underlying core component:

```tsx
// If validation fails, the Input renders the error message below the field
<FormField form={form} name="email">
  <FormInput label="Email" />
</FormField>
// Renders: <Input label="Email" error description="Enter a valid email address." />
```

## Submit flow with disabled state

```tsx
<Button
  type="submit"
  disabled={!form.formState.isValid}
  loading={form.formState.isSubmitting}
>
  {form.formState.isSubmitting ? 'Saving…' : 'Save'}
</Button>
```

## Integration with core

This package wraps `core` form components — it does not replace them. You can mix `FormField` wrappers with plain `core` components in the same form.

## Styling and theme

No additional CSS required. Styles come from `@ui-construction-library/core/styles.css`.

## Compatibility

- React 18 and 19
- react-hook-form 7.x
- TypeScript 5.x and 6.x

## Public API

```ts
import { FormField, FormInput, FormSelect, FormTextArea, FormCheckbox } from '@ui-construction-library/react-hook-form';
```

## Troubleshooting

**Validation not triggering** — confirm you are using `zodResolver` or another resolver from `@hookform/resolvers`. Without a resolver, RHF only validates on submit by default.

**Error message not showing** — confirm the `name` prop on `FormField` matches the field name in your schema exactly.
