// Remove spaces and transform to lower case
export function querifyString(s: string) {
  return s.replace(/\s+/g, '').toLocaleLowerCase();
}
