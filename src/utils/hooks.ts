import { useRef, useCallback } from 'react';

export function usePersistFn<T extends any[], R>(fn: (...args: T) => R) {
  const fnRef = useRef<typeof fn>(fn);
  fnRef.current = fn;

  const persistFn = useCallback((...args: T) => fnRef.current(...args), []);

  return persistFn;
}

export { default as useCacheFetch } from './fetchCacheHooks';
