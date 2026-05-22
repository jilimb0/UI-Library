import {
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type MotionValue = number | string | number[];

export interface MotionTransition {
  duration?: number;
  delay?: number;
  ease?: string;
  repeat?: number;
}

export interface MotionProps extends HTMLAttributes<HTMLDivElement> {
  initial?: Record<string, MotionValue>;
  animate?: Record<string, MotionValue>;
  exit?: Record<string, MotionValue>;
  variants?: Record<string, Record<string, MotionValue>>;
  transition?: MotionTransition;
}

function _toKeyframes(
  key: string,
  _from: MotionValue | undefined,
  to: MotionValue | undefined
): string | undefined {
  if (to === undefined) return undefined;
  if (key === 'opacity') {
    const end = Array.isArray(to) ? to[to.length - 1] : to;
    return String(end);
  }
  if (key === 'x') {
    const end = Array.isArray(to) ? to[to.length - 1] : to;
    return `translateX(${end}px)`;
  }
  if (key === 'y') {
    const values = Array.isArray(to) ? to : [to];
    const frames = values.map((v) => `translateY(${v}px)`);
    return frames.join('; ');
  }
  return undefined;
}

function buildStyle(
  initial?: Record<string, MotionValue>,
  animate?: Record<string, MotionValue>,
  transition?: MotionTransition
): CSSProperties {
  const style: CSSProperties = {};
  const duration = transition?.duration ?? 0.3;
  const delay = transition?.delay ?? 0;
  const easing = transition?.ease ?? 'ease';
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
      const name = `--ucl-motion-y-${Math.random().toString(36).slice(2, 8)}`;
      const keyframes = values
        .map((v, i) => {
          const pct = (i / (values.length - 1)) * 100;
          return `${pct}% { transform: translateY(${v}px); }`;
        })
        .join(' ');
      style.animation = `${name} ${duration}s ${easing} ${delay}s ${repeat === Infinity ? 'infinite' : (repeat ?? 0)} alternate`;
      (style as Record<string, string>)['--motion-keyframes'] =
        `@keyframes ${name} { ${keyframes} }`;
      if (typeof document !== 'undefined') {
        const id = `ucl-${name}`;
        if (!document.getElementById(id)) {
          const el = document.createElement('style');
          el.id = id;
          el.textContent = `@keyframes ${name} { ${keyframes} }`;
          document.head.appendChild(el);
        }
      }
    } else {
      style.transform = `translateY(${values[0]}px)`;
    }
  }

  if (
    !style.animation &&
    (animate?.opacity !== undefined || animate?.x !== undefined)
  ) {
    style.transition = `opacity ${duration}s ${easing} ${delay}s, transform ${duration}s ${easing} ${delay}s`;
  }

  return style;
}

const MotionDiv = forwardRef<HTMLDivElement, MotionProps>(function MotionDiv(
  {
    initial,
    animate,
    exit: _exit,
    variants,
    transition,
    style,
    children,
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

  useEffect(() => {
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

  return (
    <div
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      style={{ ...motionStyle, ...style }}
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
