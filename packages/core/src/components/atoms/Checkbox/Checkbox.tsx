
import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { CheckIcon } from '@ui/icons';

export interface CheckboxProps extends 
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: boolean;
  errorMessage?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ 
    className, 
    label, 
    description, 
    error, 
    errorMessage, 
    indeterminate, 
    size = 'md',
    variant = 'default',
    ...props 
  }, ref) => {
    return (
      <div className="flex items-start space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            ref={ref}
            className={cn(
              'peer appearance-none border rounded focus:ring-2 focus:ring-offset-2',
              {
                'h-4 w-4': size === 'sm',
                'h-5 w-5': size === 'md', 
                'h-6 w-6': size === 'lg',
              },
              {
                'border-gray-300 focus:ring-blue-500': variant === 'default',
                'border-green-300 focus:ring-green-500': variant === 'success',
                'border-yellow-300 focus:ring-yellow-500': variant === 'warning',
                'border-red-300 focus:ring-red-500': variant === 'danger',
              },
              error && 'border-red-500',
              className
            )}
            {...props}
          />
          {/* Checkmark icon */}
          <CheckIcon 
            className={cn(
              'absolute inset-0 w-full h-full text-white opacity-0 peer-checked:opacity-100 pointer-events-none',
              {
                'w-3 h-3': size === 'sm',
                'w-4 h-4': size === 'md',
                'w-5 h-5': size === 'lg',
              }
            )}
          />
        </div>

        {(label || description) && (
          <div className="flex-1">
            {label && (
              <label className="text-sm font-medium text-gray-900">
                {label}
              </label>
            )}
            {description && (
              <p className="text-sm text-gray-600">{description}</p>
            )}
            {error && errorMessage && (
              <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
