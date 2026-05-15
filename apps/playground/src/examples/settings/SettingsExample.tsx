import { Button, Card, Field, Form, Input } from '@ui-lib/core';

export function SettingsExample() {
  return (
    <Card>
      <h2>Settings</h2>
      <Form onSubmit={() => {}}>
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
