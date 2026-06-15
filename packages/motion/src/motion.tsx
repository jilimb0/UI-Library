import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  useInsertionEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type MotionValue = number | string | number[];

export interface MotionTransition {
  duration?: number | string;
  delay?: number | string;
  ease?: string;
  repeat?: number;
}

export interface MotionProps extends HTMLAttributes<HTMLDivElement> {
  initial?: Record<string, MotionValue>;
  animate?: Record<string, MotionValue>;
  exit?: Record<string, MotionValue>;
  variants?: Record<string, Record<string, MotionValue>>;
  transition?: MotionTransition;
  /** CSS class for animation when using CSS-only mode */
  motionClass?: string;
}

/** Resolve a duration value to a CSS-compatible string, preferring CSS vars. */
function resolveDuration(
  value: number | string | undefined,
  fallback: string
): string {
  if (value === undefined) return fallback;
  if (typeof value === 'string') return value;
  return `${value}s`;
}

/** Resolve an easing value, preferring CSS vars. */
function resolveEasing(value: string | undefined, fallback: string): string {
  return value ?? fallback;
}

function buildStyle(
  initial?: Record<string, MotionValue>,
  animate?: Record<string, MotionValue>,
  transition?: MotionTransition
): CSSProperties {
  const style: CSSProperties = {};
  const duration = resolveDuration(
    transition?.duration,
    'var(--ucl-motion-duration-normal, 300ms)'
  );
  const delay = resolveDuration(transition?.delay, '0ms');
  const easing = resolveEasing(
    transition?.ease,
    'var(--ucl-motion-easing-out, ease-out)'
  );
  const repeat = transition?.repeat;

  if (animate?.opacity !== undefined) {
    const target = Array.isArray(animate.opacity)
      ? animate.opacity[animate.opacity.length - 1]
      : animate.opacity;
    style.opacity = Number(target);
  } else if (initial?.opacity !== undefined) {
    style.opacity = Number(initial.opacity);
  }

  if (animate?.x !== undefined) {
    const x = Array.isArray(animate.x)
      ? animate.x[animate.x.length - 1]
      : animate.x;
    style.transform = `translateX(${x}px)`;
  }

  if (animate?.y !== undefined) {
    const values = Array.isArray(animate.y) ? animate.y : [animate.y];
    if (values.length > 1 || repeat !== undefined) {
      const name = `ucl-motion-y-${Math.random().toString(36).slice(2, 8)}`;
      const keyframes = values
        .map((v, i) => {
          const pct = (i / (values.length - 1)) * 100;
          return `${pct}% { transform: translateY(${v}px); }`;
        })
        .join(' ');
      style.animation = `${name} ${duration} ${easing} ${delay} ${repeat === Infinity ? 'infinite' : (repeat ?? 0)} alternate`;
      (style as Record<string, string>)['--motion-keyframes'] =
        `@keyframes ${name} { ${keyframes} }`;
    } else {
      style.transform = `translateY(${values[0]}px)`;
    }
  }

  if (
    !style.animation &&
    (animate?.opacity !== undefined || animate?.x !== undefined)
  ) {
    style.transition = `opacity ${duration} ${easing} ${delay}, transform ${duration} ${easing} ${delay}`;
  }

  return style;
}

/** SSR-safe keyframe injection via useInsertionEffect */
function useMotionKeyframes(style: CSSProperties) {
  const keyframes = (style as Record<string, string>)['--motion-keyframes'];
  const insertedRef = useRef(false);

  useInsertionEffect(() => {
    if (!keyframes || insertedRef.current) return;
    if (typeof document === 'undefined') return;

    const id = `ucl-motion-${keyframes.match(/ucl-motion-y-[a-z0-9]+/)?.[0] ?? 'kf'}`;
    if (!document.getElementById(id)) {
      const el = document.createElement('style');
      el.id = id;
      el.textContent = keyframes;
      document.head.appendChild(el);
    }
    insertedRef.current = true;
  }, [keyframes]);
}

const MotionDiv = forwardRef<HTMLDivElement, MotionProps>(function MotionDiv(
  {
    initial,
    animate,
    exit: _exit,
    variants,
    transition,
    motionClass,
    style,
    children,
    className,
    ...props
  },
  ref
) {
  const resolved = useMemo(() => {
    if (variants?.visible && !animate) {
      return { animate: variants.visible, initial: variants.hidden ?? initial };
    }
    return { initial, animate };
  }, [variants, initial, animate]);

  const [mounted, setMounted] = useState(false);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useInsertionEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const motionStyle = useMemo(
    () =>
      buildStyle(
        mounted ? resolved.animate && resolved.initial : resolved.initial,
        mounted ? resolved.animate : resolved.initial,
        transition
      ),
    [mounted, resolved, transition]
  );

  useMotionKeyframes(motionStyle);

  const combinedClassName = motionClass
    ? `${className ?? ''} ${motionClass}`.trim()
    : className;

  return (
    <div
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      style={{ ...motionStyle, ...style }}
      className={combinedClassName}
      {...props}
    >
      {children}
    </div>
  );
});

MotionDiv.displayName = 'MotionDiv';

export const motion = {
  div: MotionDiv,
};

export { MotionDiv };
