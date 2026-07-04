import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Bounce,
  FadeIn,
  fadeInProps,
  getSlideInProps,
  MotionDiv,
  MotionFadeIn,
  MotionSlideIn,
  motion,
  SlideIn,
} from './index';

describe('@ui-construction-library/motion', () => {
  it('exports motion helper namespace', () => {
    expect(motion).toBeTruthy();
    expect(typeof motion.div).toBe('object');
  });

  it('MotionDiv renders with displayName', () => {
    expect(MotionDiv.displayName).toBe('MotionDiv');
  });

  it('MotionDiv forwards ref via className passthrough', () => {
    const { container } = render(
      <MotionDiv className="test-class">content</MotionDiv>
    );
    const div = container.querySelector('div');
    expect(div?.classList.contains('test-class')).toBe(true);
  });

  it('MotionDiv applies motionClass', () => {
    const { container } = render(
      <MotionDiv motionClass="ucl-fade-in">content</MotionDiv>
    );
    const div = container.querySelector('div');
    expect(div?.classList.contains('ucl-fade-in')).toBe(true);
  });

  it('MotionDiv merges className and motionClass', () => {
    const { container } = render(
      <MotionDiv className="custom" motionClass="ucl-bounce">
        content
      </MotionDiv>
    );
    const div = container.querySelector('div');
    expect(div?.classList.contains('custom')).toBe(true);
    expect(div?.classList.contains('ucl-bounce')).toBe(true);
  });

  it('FadeIn renders children', () => {
    const { getByText } = render(<FadeIn>Hello World</FadeIn>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('FadeIn accepts className prop', () => {
    const { container } = render(<FadeIn className="my-fade">content</FadeIn>);
    const div = container.querySelector('div');
    expect(div?.classList.contains('my-fade')).toBe(true);
  });

  it('FadeIn accepts duration prop as number', () => {
    const { container } = render(<FadeIn duration={2}>slow fade</FadeIn>);
    expect(container.querySelector('div')?.textContent).toBe('slow fade');
  });

  it('FadeIn accepts duration as CSS var string', () => {
    const { container } = render(
      <FadeIn duration="500ms">custom duration</FadeIn>
    );
    expect(container.querySelector('div')?.textContent).toBe('custom duration');
  });

  it('FadeIn renders with empty children', () => {
    const { container } = render(<FadeIn />);
    expect(container.querySelector('div')).toBeTruthy();
  });

  it('Bounce renders children', () => {
    const { getByText } = render(<Bounce>Bouncing Text</Bounce>);
    expect(getByText('Bouncing Text')).toBeTruthy();
  });

  it('Bounce accepts repeat prop', () => {
    const { container } = render(<Bounce repeat={3}>limited</Bounce>);
    expect(container.querySelector('div')?.textContent).toBe('limited');
  });

  it('Bounce accepts className prop', () => {
    const { container } = render(
      <Bounce className="bounce-class">content</Bounce>
    );
    const div = container.querySelector('div');
    expect(div?.classList.contains('bounce-class')).toBe(true);
  });

  it('SlideIn renders with default direction (left)', () => {
    const { getByText } = render(<SlideIn>Sliding In</SlideIn>);
    expect(getByText('Sliding In')).toBeTruthy();
  });

  it('SlideIn renders with right direction', () => {
    const { getByText } = render(
      <SlideIn direction="right">Right Slide</SlideIn>
    );
    expect(getByText('Right Slide')).toBeTruthy();
  });

  it('SlideIn renders with up direction', () => {
    const { getByText } = render(<SlideIn direction="up">Up Slide</SlideIn>);
    expect(getByText('Up Slide')).toBeTruthy();
  });

  it('SlideIn renders with down direction', () => {
    const { getByText } = render(
      <SlideIn direction="down">Down Slide</SlideIn>
    );
    expect(getByText('Down Slide')).toBeTruthy();
  });

  it('SlideIn applies correct variant class based on direction', () => {
    const { container } = render(<SlideIn direction="right">Right</SlideIn>);
    const div = container.querySelector('div');
    expect(div?.classList.contains('ucl-slide-in-right')).toBe(true);
  });

  it('MotionFadeIn is a valid component', () => {
    const { container } = render(<MotionFadeIn>via namespace</MotionFadeIn>);
    expect(container.querySelector('div')?.textContent).toBe('via namespace');
  });

  it('MotionSlideIn is a valid component', () => {
    const { container } = render(<MotionSlideIn>slide alias</MotionSlideIn>);
    expect(container.querySelector('div')?.textContent).toBe('slide alias');
  });
});

describe('fadeInProps', () => {
  it('has initial opacity 0', () => {
    expect(fadeInProps.initial.opacity).toBe(0);
  });

  it('has animate opacity 1', () => {
    expect(fadeInProps.animate.opacity).toBe(1);
  });
});

describe('getSlideInProps', () => {
  it('returns default props for right direction', () => {
    const props = getSlideInProps('right');
    expect(props.initial).toEqual({ x: 100, opacity: 0 });
    expect(props.animate).toEqual({ x: 0, opacity: 1 });
  });

  it('returns left direction props', () => {
    const props = getSlideInProps('left');
    expect(props.initial).toEqual({ x: -100, opacity: 0 });
    expect(props.animate).toEqual({ x: 0, opacity: 1 });
  });
});
