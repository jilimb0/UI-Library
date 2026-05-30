import { Alert, Button, Card, Text } from '@ui-construction-library/core';
import { FormField } from '@ui-construction-library/react-hook-form';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SectionIntro } from './SectionIntro';

type Lead = {
  name: string;
  email: string;
  company: string;
};

export function LeadFormCard() {
  const { control, handleSubmit } = useForm<Lead>({
    defaultValues: { name: '', email: '', company: '' },
  });
  const [message, setMessage] = useState('Waiting for submit…');
  const [submitted, setSubmitted] = useState(false);

  return (
    <Card className="panel">
      <SectionIntro
        eyebrow="Integration"
        title="React Hook Form integration wired to real inputs"
        description="This card proves that the library is not just visual. The fields are connected through the dedicated integration package and show the intended form authoring experience."
      />
      <form
        onSubmit={handleSubmit((data) => {
          setMessage(`✅ Lead captured: ${data.name} (${data.company})`);
          setSubmitted(true);
        })}
      >
        <div className="stack">
          <FormField control={control as any} name="name" label="Full Name" />
          <FormField control={control as any} name="email" label="Work Email" />
          <FormField control={control as any} name="company" label="Company" />
          <Button type="submit">Create Lead</Button>
          {submitted ? (
            <Alert variant="success" title="Lead created">
              {message}
            </Alert>
          ) : (
            <Text className="text-muted">{message}</Text>
          )}
        </div>
      </form>
    </Card>
  );
}
