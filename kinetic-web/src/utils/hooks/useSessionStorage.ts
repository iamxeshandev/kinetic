import { useRef, useState, type Dispatch, type SetStateAction } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue;

      const item = window.sessionStorage.getItem(key);
      return item === null ? initialValue : (JSON.parse(item) as T);
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  const storedValueRef = useRef(storedValue);

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    const valueToStore =
      typeof value === 'function'
        ? (value as (previousValue: T) => T)(storedValueRef.current)
        : value;

    storedValueRef.current = valueToStore;
    setStoredValue(valueToStore);

    if (typeof window === 'undefined') return;

    try {
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}
