import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import DatePicker from './DatePicker';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/Molecules/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

const DatePickerWrapper = (args: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    args.selectedDate || null
  );

  return (
    <DatePicker
      {...args}
      selectedDate={selectedDate}
      onChange={(date) => {
        setSelectedDate(date);
        args.onChange?.(date);
      }}
    />
  );
};

export const Default: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    selectedDate: null,
    onChange: (date: Date) => {
      console.log('Selected date:', date);
    },
  },
};

export const WithInitialDate: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    selectedDate: new Date(),
    onChange: (date: Date) => {
      console.log('Selected date:', date);
    },
  },
};

export const WithTimezone: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    selectedDate: null,
    timezone: 'UTC',
    onChange: (date: Date) => {
      console.log('Selected date:', date);
    },
  },
};

export const Interaction: Story = {
  render: (args) => <DatePickerWrapper {...args} />,
  args: {
    selectedDate: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nextMonth = canvas.getByRole('button', { name: 'Next month' });
    await userEvent.click(nextMonth);
    await expect(await canvas.findByText(/^\w+\s\d{4}$/)).toBeInTheDocument();
  },
};
