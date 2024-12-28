import * as React from 'react';

export async function Await<T>({
  promise,
  children,
}: {
  promise: Promise<T>;
  // TODO: use ReactNode instead (we have a type error when using it)
  children: (data: T) => React.JSX.Element;
}) {
  const data = await promise;

  return children(data);
}
