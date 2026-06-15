import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { motion } from './motion';

export type BounceProps = PropsWithChildren<
  ComponentPropsWithoutRef<'div'> & { repeat?: number }
>;

export function Bounce({ children, repeat, ...props }: BounceProps) {
  return (
    <motion.div
      animate={{ y: [0, -12, 4, -2, 0] }}
      transition={{
        duration: 'var(--ucl-motion-duration-slow, 500ms)',
        repeat: repeat ?? Infinity,
      }}
      motionClass="ucl-bounce"
      {...props}
    >
      {children}
    </motion.div>
  );
}
