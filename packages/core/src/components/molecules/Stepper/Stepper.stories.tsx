import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Components/Molecules/Stepper',
  component: Stepper,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Stepper>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [step, setStep] = useState(1);
      return (
        <Stepper
          steps={[
            { id: '1', label: 'Plan' },
            { id: '2', label: 'Build' },
            { id: '3', label: 'Ship' },
          ]}
          activeStep={step}
          onStepChange={setStep}
        />
      );
    };
    return <Demo />;
  },
};
