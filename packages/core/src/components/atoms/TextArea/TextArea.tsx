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
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, size, variant, label, id, style, ...props }, ref) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <div className="flex w-full flex-col gap-1" style={style}>
        {label ? (
          <label htmlFor={fieldId} className="field-label">
            {label}
          </label>
        ) : null}
        <textarea
          id={fieldId}
          className={cn(textareaVariants({ size, variant, className }))}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export { TextArea, textareaVariants };
