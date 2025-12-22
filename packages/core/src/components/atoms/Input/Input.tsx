import { InputHTMLAttributes, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../../utils/cn"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-9",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-4",
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

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  size?: "default" | "sm" | "lg"
  label?: string
  description?: string
  error?: boolean
  errorMessage?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = "text", size, variant, label, description, ...props },
    ref
  ) => {
    const labelId = label
      ? `input-label-${Math.random().toString(36).substr(2, 9)}`
      : undefined
    const descriptionId = description
      ? `input-desc-${Math.random().toString(36).substr(2, 9)}`
      : undefined

    return (
      <div>
        {label && (
          <label id={labelId} htmlFor="input">
            {label}
          </label>
        )}
        <input
          id="input"
          type={type}
          className={cn(inputVariants({ size, variant }), className)}
          ref={ref}
          aria-labelledby={labelId}
          aria-describedby={descriptionId}
          {...props}
        />
        {description && <div id={descriptionId}>{description}</div>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
