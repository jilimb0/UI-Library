export declare function useControllableState<T>({ value, defaultValue, onChange, }: {
    value?: T;
    defaultValue?: T;
    onChange?: (value: T) => void;
}): [T | undefined, (next: T) => void];
