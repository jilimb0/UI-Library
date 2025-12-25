import React, { forwardRef, useId } from "react"
import { cn } from "../../../utils/cn"
import { CheckIcon } from "@/icons/dist/src"

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
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
      indeterminate,
      size = "md",
      variant = "default",
      ...props
    },
    ref
  ) => {
    const id = useId()

    return (
      <div className="flex items-start space-x-2">
        <div className="relative">
          <input
            id={id}
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
            {...props}
          />

          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <CheckIcon
              className={cn("text-white opacity-0 peer-checked:opacity-100", {
                "w-3 h-3": size === "sm",
                "w-4 h-4": size === "md",
                "w-5 h-5": size === "lg",
              })}
            />
          </span>
        </div>

        {(label || description || (error && errorMessage)) && (
          <div className="flex-1">
            {label && (
              <label htmlFor={id} className="text-sm font-medium text-gray-900">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
            {error && errorMessage && (
              <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"
