import { motion } from './motion';

type SlideDirection = 'left' | 'right';

export const MotionFadeIn = motion.div;

export const fadeInProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function getSlideInProps(direction: SlideDirection = 'right') {
  const x = direction === 'right' ? 100 : -100;
  return {
    initial: { x, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x, opacity: 0 },
  };
}

export const MotionSlideIn = motion.div;
