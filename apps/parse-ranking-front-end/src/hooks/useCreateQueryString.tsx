import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useCreateQueryString() {
  const searchParams = useSearchParams();

  return useCallback(
    (
      name: string,
      value: string,
      options?: { keepPreviousParams?: boolean }
    ) => {
      const params = new URLSearchParams(
        options?.keepPreviousParams ? searchParams.toString() : undefined
      );
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
}
