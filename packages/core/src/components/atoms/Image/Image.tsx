import { forwardRef, type ImgHTMLAttributes, useState } from 'react';
import { cn } from '../../../utils/cn';

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  aspectRatio?: string;
}

const Image = forwardRef<HTMLDivElement, ImageProps>(
  (
    {
      fallbackSrc,
      className,
      aspectRatio,
      loading = 'lazy',
      style,
      onError,
      ...props
    },
    ref
  ) => {
    const [failed, setFailed] = useState(false);
    return (
      <div
        ref={ref}
        className={cn('image-wrapper', className)}
        style={{ aspectRatio, overflow: 'hidden', ...style }}
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
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }
);

Image.displayName = 'Image';

export { Image };
