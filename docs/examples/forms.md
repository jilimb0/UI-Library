# Form Recipes

Copy-ready patterns for building validated, accessible forms with `@ui-construction-library/core`.

---

## Basic form with validation

```tsx
import { useState } from 'react';
import { Button, Input, Select } from '@ui-construction-library/core';

type FormState = {
  name: string;
  email: string;
  role: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Name is required.';
  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!values.role) errors.role = 'Select a role.';
  return errors;
}

export function InviteForm() {
  const [values, setValues] = useState<FormState>({ name: '', email: '', role: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate(values);
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return <p>Invite sent to {values.email}.</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '28rem' }}>
      <Input
        label="Full name"
        value={values.name}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
        error={Boolean(errors.name)}
        description={errors.name}
      />
      <Input
        label="Email"
        type="email"
        value={values.email}
        onChange={(e) => setValues({ ...values, email: e.target.value })}
        error={Boolean(errors.email)}
        description={errors.email}
      />
      <Select
        label="Role"
        value={values.role}
        onChange={(e) => setValues({ ...values, role: e.target.value })}
        error={Boolean(errors.role)}
        description={errors.role}
        options={[
          { value: '', label: 'Select a role…' },
          { value: 'editor', label: 'Editor' },
          { value: 'commenter', label: 'Commenter' },
          { value: 'viewer', label: 'Viewer' },
        ]}
      />
      <Button type="submit">Send invite</Button>
    </form>
  );
}
```

---

## React Hook Form integration

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, TextArea } from '@ui-construction-library/core';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  url: z.string().url('Enter a valid URL.').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export function ProjectForm({ onSave }: { onSave: (data: FormValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(onSave)} style={{ display: 'grid', gap: '1rem', maxWidth: '32rem' }}>
      <Input
        label="Project title"
        {...register('title')}
        error={Boolean(errors.title)}
        description={errors.title?.message}
      />
      <TextArea
        label="Description"
        rows={4}
        {...register('description')}
        error={Boolean(errors.description)}
        description={errors.description?.message}
      />
      <Input
        label="Repository URL"
        type="url"
        placeholder="https://github.com/org/repo"
        {...register('url')}
        error={Boolean(errors.url)}
        description={errors.url?.message}
      />
      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save project'}
      </Button>
    </form>
  );
}
```

---

## Multi-step form

```tsx
import { useState } from 'react';
import { Button, Input, Stepper } from '@ui-construction-library/core';

const STEPS = ['Account', 'Profile', 'Review'];

export function OnboardingForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ email: '', name: '', bio: '' });

  const isLast = step === STEPS.length - 1;

  return (
    <div style={{ maxWidth: '32rem', display: 'grid', gap: '1.5rem' }}>
      <Stepper steps={STEPS} currentStep={step} />

      {step === 0 && (
        <Input
          label="Email"
          type="email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      )}

      {step === 1 && (
        <>
          <Input
            label="Display name"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          <Input
            label="Bio"
            value={data.bio}
            onChange={(e) => setData({ ...data, bio: e.target.value })}
          />
        </>
      )}

      {step === 2 && (
        <div style={{ display: 'grid', gap: '0.5rem', fontSize: '0.875rem' }}>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Bio:</strong> {data.bio}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <Button onClick={() => isLast ? console.log('submit', data) : setStep(step + 1)}>
          {isLast ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
```

---

## Settings form with sections

```tsx
import { Button, Card, Heading, Input, Switch, Text } from '@ui-construction-library/core';
import { useState } from 'react';

export function NotificationSettings() {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [digest, setDigest] = useState(true);

  return (
    <div style={{ display: 'grid', gap: '1rem', maxWidth: '36rem' }}>
      <Card className="p-6">
        <Heading as="h3">Notifications</Heading>
        <Text style={{ color: 'var(--muted-foreground)', marginBottom: '1.25rem' }}>
          Choose how you want to be notified about activity.
        </Text>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {[
            { label: 'Email notifications', description: 'Receive updates via email.', value: email, onChange: setEmail },
            { label: 'Push notifications', description: 'Receive browser push alerts.', value: push, onChange: setPush },
            { label: 'Weekly digest', description: 'A summary of activity every Monday.', value: digest, onChange: setDigest },
          ].map(({ label, description, value, onChange }) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
              <div>
                <Text style={{ fontWeight: 500 }}>{label}</Text>
                <Text style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>{description}</Text>
              </div>
              <Switch checked={value} onCheckedChange={onChange} />
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button>Save preferences</Button>
      </div>
    </div>
  );
}
```
