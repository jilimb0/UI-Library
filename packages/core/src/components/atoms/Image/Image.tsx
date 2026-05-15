import { type ImgHTMLAttributes, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: string;
}

export function Image({
  fallbackSrc,
  className,
  aspectRatio,
  loading = 'lazy',
  style,
  onError,
  ...props
}: ImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{ aspectRatio, ...style }}
    >
      <img
        alt=""
        {...props}
        loading={loading}
        src={failed && fallbackSrc ? fallbackSrc : props.src}
        onError={(e) => {
          setFailed(true);
          onError?.(e);
        }}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
