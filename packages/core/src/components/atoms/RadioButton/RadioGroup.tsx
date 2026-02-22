import { createContext, useContext, type ReactNode } from 'react';

type RadioGroupContextValue = {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export function RadioGroup({
  name,
  value,
  onChange,
  children,
}: {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <fieldset>
      <RadioGroupContext.Provider value={{ name, value, onChange }}>
        {children}
      </RadioGroupContext.Provider>
    </fieldset>
  );
}

export function useRadioGroup() {
  return useContext(RadioGroupContext);
}
