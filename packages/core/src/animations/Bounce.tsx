import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export function Bounce({ children, ...props }: PropsWithChildren<any>) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 0.6, repeat: Infinity }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
