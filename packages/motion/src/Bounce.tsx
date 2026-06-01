import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { motion } from './motion';

export type BounceProps = PropsWithChildren<ComponentPropsWithoutRef<'div'>>;

export function Bounce({ children, ...props }: BounceProps) {
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
