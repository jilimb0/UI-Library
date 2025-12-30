import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../../utils/cn"
import { forwardRef, TextareaHTMLAttributes } from "react"

const textareaVariants = cva(
  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-20",
        sm: "h-14 px-2 text-xs",
        lg: "h-28 px-4",
      },
      variant: {
        default: "border-input",
        error: "border-destructive focus-visible:ring-destructive",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

interface TextAreaProps
  extends
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, size, variant, ...props }, ref) => {
    return (
      <textarea
        className={cn(textareaVariants({ size, variant, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

TextArea.displayName = "TextArea"

export { TextArea, textareaVariants }
