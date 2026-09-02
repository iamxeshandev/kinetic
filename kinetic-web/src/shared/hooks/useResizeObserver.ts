// src/shared/hooks/useResizeObserver.ts
import { useLayoutEffect, useRef, useState } from 'react';

interface Size {
  width: number;
  height: number;
}

export function useResizeObserver<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      const borderBoxSize = Array.isArray(entry.borderBoxSize)
        ? entry.borderBoxSize[0]
        : entry.borderBoxSize;
      const width = borderBoxSize?.inlineSize ?? entry.contentRect.width;
      const height = borderBoxSize?.blockSize ?? entry.contentRect.height;
      setSize({ width, height });
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, ...size };
}
