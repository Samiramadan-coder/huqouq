"use client";

import { useEffect, useRef, useState } from "react";

// Mirrors `value` for instant input feedback, calling `onChange` only after changes pause for `delay` ms.
export function useDebouncedState<T>(
  value: T,
  onChange: (value: T) => void,
  delay = 500,
) {
  const [localValue, setLocalValue] = useState(value);
  const onChangeRef = useRef(onChange);
  // eslint-disable-next-line react-hooks/refs
  onChangeRef.current = onChange;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (localValue === value) return;

    const timeout = setTimeout(() => onChangeRef.current(localValue), delay);
    return () => clearTimeout(timeout);
  }, [localValue, value, delay]);

  return [localValue, setLocalValue] as const;
}
