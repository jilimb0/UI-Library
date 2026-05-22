import type { PropsWithChildren } from 'react';
import { motion } from '../adapters/motion';

export function FadeIn({ children, ...props }: PropsWithChildren<any>) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
