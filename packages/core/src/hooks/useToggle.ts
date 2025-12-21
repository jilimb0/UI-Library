import * as React from 'react';

export function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = React.useState(initial);
  const toggle = () => setValue(v => !v);
  return [value, toggle];
}
