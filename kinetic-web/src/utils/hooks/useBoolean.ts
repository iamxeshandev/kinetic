import { useCallback, useMemo, useState } from 'react';

export function useBoolean(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  const toggle = useCallback(() => setValue((prev) => !prev), []);

  return useMemo(
    () => ({ value, setTrue, setFalse, toggle }),
    [setFalse, setTrue, toggle, value],
  );
}
