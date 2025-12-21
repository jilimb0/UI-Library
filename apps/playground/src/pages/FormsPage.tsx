
import React, { useState } from 'react';
import { Form, Field, Input, Textarea, Button } from '@ui/core';

export function FormsPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Name: ${name}
Message: ${message}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Forms Examples</h2>
      <Form onSubmit={handleSubmit}>
        <Field label="Name">
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Message">
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
        </Field>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
