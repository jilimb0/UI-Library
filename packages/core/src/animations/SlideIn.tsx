import type { PropsWithChildren } from 'react';
import { motion } from '../adapters/motion';

export function SlideIn({
  children,
  direction = 'left',
  ...props
}: PropsWithChildren<{ direction?: 'left' | 'right' | 'up' | 'down' }>) {
  const variants = {
    hidden: {
      x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
      y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
      opacity: 0,
    },
    visible: { x: 0, y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial={variants.hidden}
      animate={variants.visible}
      exit={variants.hidden}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
