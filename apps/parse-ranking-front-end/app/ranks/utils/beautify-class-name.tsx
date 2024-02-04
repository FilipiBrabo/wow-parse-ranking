export function beautifyClassName(className: string) {
  if (className.toLowerCase() === 'deathknight') {
    return 'Death Knight';
  }

  return className.charAt(0).toUpperCase() + className.slice(1);
}
