import { cn } from '../../../utils/cn';
import { forwardRef, ImgHTMLAttributes, ReactNode, useState } from 'react';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
};

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ fallback, size = 'md', className, ...props }, ref) => {
    const [isError, setIsError] = useState(false);
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-full bg-gray-100',
          sizeClasses[size],
          className
        )}
      >
        {!isError && (
          <img
            ref={ref}
            {...props}
            alt={props.alt || ''}
            onError={() => setIsError(true)}
          />
        )}
        {isError && fallback}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

export { Avatar };
