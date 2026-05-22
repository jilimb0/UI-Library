import {
  type ButtonHTMLAttributes,
  createContext,
  forwardRef,
  type HTMLAttributes,
  useContext,
} from 'react';
import { useControllableState } from './internal/useControllableState';

type SwitchContextValue = {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  disabled?: boolean;
};

const SwitchContext = createContext<SwitchContextValue | null>(null);

export type SwitchProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const Root = forwardRef<HTMLButtonElement, SwitchProps>(function Root(
  {
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    onClick,
    children,
    ...props
  },
  ref
) {
  const [current, setChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked ?? false,
    onChange: onCheckedChange,
  });

  return (
    <SwitchContext.Provider
      value={{ checked: Boolean(current), setChecked, disabled }}
    >
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={Boolean(current)}
        data-state={current ? 'checked' : 'unchecked'}
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented && !disabled) setChecked(!current);
        }}
        {...props}
      >
        {children}
      </button>
    </SwitchContext.Provider>
  );
});

const Thumb = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function Thumb(props, ref) {
    const ctx = useContext(SwitchContext);
    return (
      <span
        ref={ref}
        data-state={ctx?.checked ? 'checked' : 'unchecked'}
        {...props}
      />
    );
  }
);

export const Switch = { Root, Thumb };
