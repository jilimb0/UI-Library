import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { DatePicker } from './DatePicker';

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
