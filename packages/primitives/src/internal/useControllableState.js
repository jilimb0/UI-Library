import { useCallback, useState } from 'react';
export function useControllableState({ value, defaultValue, onChange, }) {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const isControlled = value !== undefined;
    const current = isControlled ? value : uncontrolled;
    const setValue = useCallback((next) => {
        if (!isControlled)
            setUncontrolled(next);
        onChange?.(next);
    }, [isControlled, onChange]);
    return [current, setValue];
}
