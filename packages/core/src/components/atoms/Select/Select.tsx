import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../../utils/cn"

const selectVariants = cva(
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        default: "h-9",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  size?: "default" | "sm" | "lg"
  label?: string
  description?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <select
        className={cn(selectVariants({ size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Select.displayName = "Select"

export { Select, selectVariants }
