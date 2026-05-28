import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from '../../atoms/Heading';
import { Text } from '../../atoms/Text';
import { Accordion } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Organisms/Accordion',
  component: Accordion,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Accordion>;

const AccordionItem = ({ isOpen, onToggle, title, children }: any) => (
  <div className="border-b">
    <button
      type="button"
      onClick={onToggle}
      className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50"
    >
      <Heading level={4}>{title}</Heading>
      <span>{isOpen ? '−' : '+'}</span>
    </button>
    {isOpen && <div className="p-4 bg-gray-50">{children}</div>}
  </div>
);

export const Default: Story = {
  args: {
    children: (
      <>
        <AccordionItem title="Section 1">
          <Text>Content for section 1</Text>
        </AccordionItem>
        <AccordionItem title="Section 2">
          <Text>Content for section 2</Text>
        </AccordionItem>
        <AccordionItem title="Section 3">
          <Text>Content for section 3</Text>
        </AccordionItem>
      </>
    ),
  },
};

export const Multiple: Story = {
  args: {
    children: (
      <>
        <AccordionItem title="Section 1">
          <Text>Content for section 1</Text>
        </AccordionItem>
        <AccordionItem title="Section 2">
          <Text>Content for section 2</Text>
        </AccordionItem>
        <AccordionItem title="Section 3">
          <Text>Content for section 3</Text>
        </AccordionItem>
      </>
    ),
  },
};
