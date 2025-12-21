
import React from 'react';
import { Card, Form, Field, Input, Button } from '@ui/core';

export function SettingsExample() {
  return (
    <Card>
      <h2>Settings</h2>
      <Form>
        <Field label="Username">
          <Input placeholder="Username" />
        </Field>
        <Field label="Email">
          <Input type="email" placeholder="Email" />
        </Field>
        <Button>Save Settings</Button>
      </Form>
    </Card>
  );
}
