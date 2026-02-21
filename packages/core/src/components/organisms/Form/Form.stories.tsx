import type { Meta, StoryObj } from '@storybook/react';
import { Form } from './Form';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button';
import { Field } from '../../molecules/Field';

const meta: Meta<typeof Form> = {
  title: 'Components/Organisms/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  args: {
    onSubmit: (data) => {
      console.log('Form submitted:', data);
    },
    children: (
      <div className="space-y-4 w-96">
        <Field label="Email">
          <Input type="email" placeholder="Enter your email" />
        </Field>
        <Field label="Password">
          <Input type="password" placeholder="Enter your password" />
        </Field>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </div>
    ),
  },
};

export const WithValidation: Story = {
  args: {
    onSubmit: (data) => {
      console.log('Form submitted:', data);
    },
    children: (
      <div className="space-y-4 w-96">
        <Field label="Email" error="Email is required">
          <Input type="email" placeholder="Enter your email" />
        </Field>
        <Field label="Password" description="Must be at least 8 characters">
          <Input type="password" placeholder="Enter your password" />
        </Field>
        <Button type="submit" variant="primary">
          Submit
        </Button>
      </div>
    ),
  },
};
