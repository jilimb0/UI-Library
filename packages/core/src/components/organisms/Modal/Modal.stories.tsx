import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { default as Modal } from './Modal';
import { Button } from '../../atoms/Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Organisms/Modal',
  component: Modal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Modal>;

const ModalWrapper = ({
  isOpen: initialOpen = false,
  children,
  ...args
}: any) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {children}
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <h2 className="text-xl font-bold mb-4">Modal Title</h2>
      <p className="mb-4">This is a simple modal dialog.</p>
    </ModalWrapper>
  ),
};

export const WithContent: Story = {
  render: (args) => (
    <ModalWrapper {...args}>
      <h2 className="text-xl font-bold mb-4">Confirm Action</h2>
      <p className="mb-4">Are you sure you want to proceed with this action?</p>
      <div className="flex gap-2">
        <Button variant="default">Confirm</Button>
        <Button variant="secondary">Cancel</Button>
      </div>
    </ModalWrapper>
  ),
};
