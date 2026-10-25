import { forwardRef, type TextareaHTMLAttributes, useId } from 'react';
import { cn } from '../../../utils/cn';
import { tv, type VariantProps } from '../../../utils/variants';

const textareaVariants = tv({
  base: 'textarea input',
  variants: {
    size: {
      default: '',
      sm: 'input--sm',
      lg: 'input--lg',
    },
    variant: {
      default: '',
      error: 'input--error',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  /** Override class names for individual slots. */
  classNames?: {
    root?: string;
    label?: string;
    textarea?: string;
  };
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      size,
      variant,
      label,
      id,
      style,
      classNames: slotClassNames,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <div
        className={cn('flex w-full flex-col gap-1', slotClassNames?.root)}
        style={style}
      >
        {label ? (
          <label
            htmlFor={fieldId}
            className={cn('field-label', slotClassNames?.label)}
          >
            {label}
          </label>
        ) : null}
        <textarea
          id={fieldId}
          className={cn(
            textareaVariants({ size, variant }),
            slotClassNames?.textarea,
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export { TextArea, textareaVariants };
