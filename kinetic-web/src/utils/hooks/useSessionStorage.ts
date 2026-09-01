import { useCallback, useState } from 'react';

export function useSessionStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        setState((prev) => {
          const nextValue =
            typeof value === 'function'
              ? (value as (val: T) => T)(prev)
              : value;

          sessionStorage.setItem(key, JSON.stringify(nextValue));
          return nextValue;
        });
      } catch (error) {
        console.error(error);
      }
    },
    [key],
  );

  return [state, setValue] as const;
}
