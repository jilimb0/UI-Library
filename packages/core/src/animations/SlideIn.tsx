import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

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
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
