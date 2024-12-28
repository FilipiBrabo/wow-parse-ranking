import * as React from 'react';

export async function Await<T>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (data: T) => React.ReactNode;
}) {
  const data = await promise;

  return children(data);
}
