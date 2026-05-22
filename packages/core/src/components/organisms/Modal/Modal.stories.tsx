import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useState } from 'react';
import { Button } from '../../atoms/Button';
import { Modal } from './Modal';

const meta: Meta = {
  title: 'Components/Organisms/Modal',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj;

function ModalDemo({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Content title={title}>
          <Modal.Body>{children}</Modal.Body>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button variant="outline">Close</Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}

export const Default: Story = {
  render: () => (
    <ModalDemo title="Modal title">
      <p>This is a simple modal dialog.</p>
    </ModalDemo>
  ),
};

export const WithActions: Story = {
  render: () => (
    <ModalDemo title="Confirm action">
      <p>Are you sure you want to proceed with this action?</p>
      <div className="inline-cluster" style={{ marginTop: 12 }}>
        <Button>Confirm</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </ModalDemo>
  ),
};
