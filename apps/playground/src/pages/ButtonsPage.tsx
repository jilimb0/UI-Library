import { Button } from '@ui-lib/core';

export function ButtonsPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Buttons Examples</h2>
      <Button variant="default">Default Button</Button>
      <Button variant="default" style={{ marginLeft: 10 }}>
        Primary Button
      </Button>
      <Button variant="destructive" style={{ marginLeft: 10 }}>
        Destructive Button
      </Button>
    </div>
  );
}
