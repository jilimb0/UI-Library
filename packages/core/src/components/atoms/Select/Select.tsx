import React, { useId } from "react"
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

type Option = { value: string; label: string }

export interface SelectProps
  extends
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  size?: "default" | "sm" | "lg"
  label?: string
  description?: string
  options?: Option[]
  error?: boolean
  errorMessage?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      size,
      label,
      description,
      options,
      error,
      errorMessage,
      className,
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const internalId = useId()
    const selectId = id ?? internalId
    const labelId = `${selectId}-label`
    const descriptionId = `${selectId}-description`

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e)
    }

    return (
      <div className="flex flex-col space-y-1">
        {label && (
          <label
            id={labelId}
            htmlFor={selectId}
            className="text-sm font-medium"
          >
            {label}
          </label>
        )}
        <select
          id={selectId}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={
            description || (error && errorMessage) ? descriptionId : undefined
          }
          className={cn(selectVariants({ size, className }))}
          ref={ref}
          onChange={handleChange}
          {...props}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {(description || (error && errorMessage)) && (
          <p id={descriptionId} className="text-xs text-muted-foreground">
            {error && errorMessage ? errorMessage : description}
          </p>
        )}
      </div>
    )
  }
)
