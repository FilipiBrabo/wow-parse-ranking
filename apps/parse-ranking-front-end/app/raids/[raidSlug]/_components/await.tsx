export async function Await<T>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (data: T) => JSX.Element;
}) {
  const data = await promise;

  return children(data);
}
