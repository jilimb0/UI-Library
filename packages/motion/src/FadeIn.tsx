import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { motion } from './motion';

export type FadeInProps = PropsWithChildren<ComponentPropsWithoutRef<'div'>>;

export function FadeIn({ children, ...props }: FadeInProps) {
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
