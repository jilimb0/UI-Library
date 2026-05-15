import { Button, Modal } from '@ui-lib/core';
import { useState } from 'react';

export function ModalsPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ padding: 20 }}>
      <h2>Modal Examples</h2>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <div style={{ padding: 20 }}>
          <h3>This is a modal</h3>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </div>
      </Modal>
    </div>
  );
}
