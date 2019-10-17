export function sanitizeForRegex(str: string) {
  return str
    .split('')
    .map(char => (['$', '^', '/'].includes(char) ? `\\${char}` : char))
    .join('');
}
