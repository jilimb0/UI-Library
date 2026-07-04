import type { Meta, StoryObj } from '@storybook/react-vite';
import { Bounce } from '../Bounce';
import { FadeIn } from '../FadeIn';
import { MotionDiv } from '../motion';
import { SlideIn } from '../SlideIn';

// ---------------------------------------------------------------------------
// FadeIn
// ---------------------------------------------------------------------------

const FadeInMeta: Meta<typeof FadeIn> = {
  title: 'Motion/FadeIn',
  component: FadeIn,
  tags: ['autodocs'],
  argTypes: {
    duration: {
      control: { type: 'text' },
      description: 'Animation duration (CSS value like "300ms", "0.5s")',
    },
  },
};

export default FadeInMeta;
type FadeInStory = StoryObj<typeof FadeIn>;

export const FadeInDefault: FadeInStory = {
  args: {
    children: (
      <div
        style={{
          padding: 32,
          background: '#1976d2',
          color: '#fff',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        Fades in on mount
      </div>
    ),
  },
};

export const FadeInFast: FadeInStory = {
  name: 'FadeIn (fast)',
  args: {
    duration: '150ms',
    children: (
      <div
        style={{
          padding: 32,
          background: '#388e3c',
          color: '#fff',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        Fast fade-in (150ms)
      </div>
    ),
  },
};

export const FadeInSlow: FadeInStory = {
  name: 'FadeIn (slow)',
  args: {
    duration: '1s',
    children: (
      <div
        style={{
          padding: 32,
          background: '#e64a19',
          color: '#fff',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        Slow fade-in (1s)
      </div>
    ),
  },
};

// ---------------------------------------------------------------------------
// Bounce
// ---------------------------------------------------------------------------

const _BounceMeta: Meta<typeof Bounce> = {
  title: 'Motion/Bounce',
  component: Bounce,
  tags: ['autodocs'],
  argTypes: {
    repeat: {
      control: { type: 'number' },
      description: 'Number of repetitions (Infinity by default)',
    },
  },
};

export const BounceInfinite: StoryObj<typeof Bounce> = {
  name: 'Bounce (infinite)',
  render: () => (
    <Bounce>
      <div
        style={{
          width: 80,
          height: 80,
          background: '#7b1fa2',
          color: '#fff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
        }}
      >
        BOUNCE
      </div>
    </Bounce>
  ),
};

export const BounceThreeTimes: StoryObj<typeof Bounce> = {
  name: 'Bounce (3 times)',
  render: () => (
    <Bounce repeat={3}>
      <div
        style={{
          width: 80,
          height: 80,
          background: '#00897b',
          color: '#fff',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
        }}
      >
        3x
      </div>
    </Bounce>
  ),
};

// ---------------------------------------------------------------------------
// SlideIn
// ---------------------------------------------------------------------------

const _SlideInMeta: Meta<typeof SlideIn> = {
  title: 'Motion/SlideIn',
  component: SlideIn,
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: { type: 'select' },
      options: ['left', 'right', 'up', 'down'],
    },
  },
};

export const SlideInFromLeft: StoryObj<typeof SlideIn> = {
  name: 'SlideIn from left',
  args: {
    direction: 'left',
    children: (
      <div
        style={{
          padding: 24,
          background: '#1565c0',
          color: '#fff',
          borderRadius: 8,
        }}
      >
        Slides in from the left
      </div>
    ),
  },
};

export const SlideInFromRight: StoryObj<typeof SlideIn> = {
  name: 'SlideIn from right',
  args: {
    direction: 'right',
    children: (
      <div
        style={{
          padding: 24,
          background: '#2e7d32',
          color: '#fff',
          borderRadius: 8,
        }}
      >
        Slides in from the right
      </div>
    ),
  },
};

export const SlideInFromTop: StoryObj<typeof SlideIn> = {
  name: 'SlideIn from top',
  args: {
    direction: 'up',
    children: (
      <div
        style={{
          padding: 24,
          background: '#c62828',
          color: '#fff',
          borderRadius: 8,
        }}
      >
        Slides in from the top
      </div>
    ),
  },
};

export const SlideInFromBottom: StoryObj<typeof SlideIn> = {
  name: 'SlideIn from bottom',
  args: {
    direction: 'down',
    children: (
      <div
        style={{
          padding: 24,
          background: '#f57f17',
          color: '#fff',
          borderRadius: 8,
        }}
      >
        Slides in from the bottom
      </div>
    ),
  },
};

// ---------------------------------------------------------------------------
// MotionDiv
// ---------------------------------------------------------------------------

const _MotionDivMeta: Meta<typeof MotionDiv> = {
  title: 'Motion/MotionDiv',
  component: MotionDiv,
  tags: ['autodocs'],
};

export const MotionDivOpacity: StoryObj<typeof MotionDiv> = {
  name: 'MotionDiv (opacity)',
  render: () => (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: '500ms', ease: 'ease-in-out' }}
    >
      <div
        style={{
          padding: 32,
          background: '#455a64',
          color: '#fff',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        Custom opacity transition (500ms)
      </div>
    </MotionDiv>
  ),
};

export const MotionDivSlide: StoryObj<typeof MotionDiv> = {
  name: 'MotionDiv (slide + fade)',
  render: () => (
    <MotionDiv
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'ease-out' }}
    >
      <div
        style={{
          padding: 32,
          background: '#6a1b9a',
          color: '#fff',
          borderRadius: 8,
          textAlign: 'center',
        }}
      >
        Slides in from -50px and fades in (400ms)
      </div>
    </MotionDiv>
  ),
};

export const MotionDivBounceEffect: StoryObj<typeof MotionDiv> = {
  name: 'MotionDiv (bounce effect)',
  render: () => (
    <MotionDiv
      animate={{ y: [0, -15, 5, -3, 0] }}
      transition={{ duration: 0.6, repeat: Infinity }}
    >
      <div
        style={{
          width: 100,
          height: 100,
          background: '#ff6f00',
          color: '#fff',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
        }}
      >
        BOUNCE
      </div>
    </MotionDiv>
  ),
};
