import { type AnchorHTMLAttributes, forwardRef } from 'react';
import { cn, tv, type VariantProps } from '../../../utils/cn';
import { Slot } from '../../../utils/slot';

const linkVariants = tv({
  base: 'link',
  variants: {
    variant: {
      default: '',
      subtle: 'link--subtle',
    },
  },
  defaultVariants: { variant: 'default' },
});

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {
  /** Render as a child element (Slot pattern — use with router links). */
  asChild?: boolean;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { variant = 'default', className, style, asChild = false, ...props },
    ref
  ) => {
    const linkClass = cn(linkVariants({ variant }), className);

    if (asChild) {
      return (
        <Slot
          ref={ref as React.Ref<HTMLElement>}
          className={linkClass}
          style={style}
          {...(props as React.HTMLAttributes<HTMLElement>)}
        />
      );
    }

    return <a ref={ref} className={linkClass} style={style} {...props} />;
  }
);

Link.displayName = 'Link';

export { Link, linkVariants };
