import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
} from 'react';

type RadioGroupContextValue = {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function RadioGroup({
  name,
  value,
  onChange,
  onValueChange,
  className,
  style,
  children,
}: {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <fieldset className={className} style={style}>
      <RadioGroupContext.Provider
        value={{ name, value, onChange, onValueChange }}
      >
        {children}
      </RadioGroupContext.Provider>
    </fieldset>
  );
}

export function useRadioGroup() {
  return useContext(RadioGroupContext);
}
