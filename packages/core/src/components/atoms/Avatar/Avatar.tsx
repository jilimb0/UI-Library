import {
  forwardRef,
  type ImgHTMLAttributes,
  type ReactNode,
  useState,
} from 'react';
import { cn } from '../../../utils/cn';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallback?: ReactNode;
  size?: 'sm' | 'default' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'avatar--sm',
  default: 'avatar--md',
  md: 'avatar--md',
  lg: 'avatar--lg',
};

const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ fallback, size = 'default', className, style, ...props }, ref) => {
    const [isError, setIsError] = useState(false);
    return (
      <div className={cn('avatar', sizeClasses[size], className)} style={style}>
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
