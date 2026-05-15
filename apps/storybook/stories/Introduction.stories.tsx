import type { Meta, StoryObj } from '@storybook/react';

function Introduction() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, padding: '2rem' }}>
      <h1>UI Library</h1>
      <p>
        Production-oriented React UI library with TypeScript and Tailwind CSS.
      </p>
    </div>
  );
}

const meta: Meta<typeof Introduction> = {
  title: 'Design System/Introduction',
  component: Introduction,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Introduction>;

export const Default: Story = {};
