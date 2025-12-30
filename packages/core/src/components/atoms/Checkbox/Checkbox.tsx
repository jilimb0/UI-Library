import { forwardRef, InputHTMLAttributes, useId } from "react"
import { cn } from "../../../utils/cn"

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string
  description?: string
  error?: boolean
  errorMessage?: string
  indeterminate?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning" | "danger"
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      error,
      errorMessage,
      size = "md",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const id = useId()
    const labelId = `${id}-label`
    const descriptionId = `${id}-description`

    return (
      <div className="flex items-start space-x-2">
        <div className="relative">
          <input
            id={id}
            aria-labelledby={labelId}
            type="checkbox"
            ref={ref}
            className={cn(
              "peer appearance-none border rounded focus:ring-2 focus:ring-offset-2",
              {
                "h-4 w-4": size === "sm",
                "h-5 w-5": size === "md",
                "h-6 w-6": size === "lg",
              },
              {
                "border-gray-300 focus:ring-blue-500": variant === "default",
                "border-green-300 focus:ring-green-500": variant === "success",
                "border-yellow-300 focus:ring-yellow-500":
                  variant === "warning",
                "border-red-300 focus:ring-red-500": variant === "danger",
              },
              error && "border-red-500",
              className
            )}
            aria-describedby={
              description || (error && errorMessage) ? descriptionId : undefined
            }
            {...props}
          />

          <img
            src="/public/icons/interface/CheckIcon.svg"
            alt="checkbox"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          />
        </div>

        {(label || description || (error && errorMessage)) && (
          <div className="flex-1">
            {label && (
              <label
                htmlFor={id}
                id={labelId}
                className="text-sm font-medium text-gray-900"
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
            {error && errorMessage && (
              <p className="mt-1 text-sm text-red-600" aria-live="polite">
                {errorMessage}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"
