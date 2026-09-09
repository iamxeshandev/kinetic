import { useCallback, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
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

          if (nextValue) {
            localStorage.setItem(key, JSON.stringify(nextValue));
          } else {
            localStorage.removeItem(key);
          }

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
