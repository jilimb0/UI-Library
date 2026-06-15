import type { PropsWithChildren } from 'react';
import { motion } from './motion';

export function SlideIn({
  children,
  direction = 'left',
  ...props
}: PropsWithChildren<{ direction?: 'left' | 'right' | 'up' | 'down' }>) {
  const variants = {
    hidden: {
      x: direction === 'left' ? -8 : direction === 'right' ? 8 : 0,
      y: direction === 'up' ? -8 : direction === 'down' ? 8 : 0,
      opacity: 0,
    },
    visible: { x: 0, y: 0, opacity: 1 },
  };

  const motionClassMap = {
    left: 'ucl-slide-in-left',
    right: 'ucl-slide-in-right',
    up: 'ucl-slide-in-up',
    down: 'ucl-slide-in-down',
  };

  return (
    <motion.div
      initial={variants.hidden}
      animate={variants.visible}
      exit={variants.hidden}
      transition={{
        duration: 'var(--ucl-motion-duration-normal, 300ms)',
      }}
      motionClass={motionClassMap[direction]}
      {...props}
    >
      {children}
    </motion.div>
  );
}
