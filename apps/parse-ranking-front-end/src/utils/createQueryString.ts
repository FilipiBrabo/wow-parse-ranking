export function createQueryString(
  name: string,
  value: string,
  previousSearchParams?: URLSearchParams
) {
  const params = new URLSearchParams(previousSearchParams?.toString());
  params.set(name, value);

  return params.toString();
}
