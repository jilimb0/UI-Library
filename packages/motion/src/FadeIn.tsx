import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { motion } from './motion';

export type FadeInProps = PropsWithChildren<
  ComponentPropsWithoutRef<'div'> & { duration?: number | string }
>;

export function FadeIn({ children, duration, ...props }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: duration ?? 'var(--ucl-motion-duration-normal, 300ms)',
      }}
      motionClass="ucl-fade-in"
      {...props}
    >
      {children}
    </motion.div>
  );
}
