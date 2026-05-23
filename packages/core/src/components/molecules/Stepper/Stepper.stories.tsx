import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { Stepper } from './Stepper';

const STEPS = [
  { id: 'details', label: 'Details' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
];

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
      const [activeStep, setActiveStep] = useState(0);
      return (
        <Stepper
          steps={STEPS}
          activeStep={activeStep}
          onStepChange={setActiveStep}
          linear={false}
        />
      );
    };
    return <Demo />;
  },
};

export const Interaction: Story = {
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Review/i }));
    const indicator = canvas.getByText('2');
    await expect(indicator.className).toContain('stepper__indicator--active');
  },
};
