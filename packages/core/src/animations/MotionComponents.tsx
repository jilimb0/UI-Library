
import { motion } from 'framer-motion';

export const FadeIn = motion.div.attrs({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
});

export const SlideIn = motion.div.attrs(({ direction = 'right' }) => ({
  initial: { x: direction === 'right' ? 100 : -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: direction === 'right' ? 100 : -100, opacity: 0 }
}));
