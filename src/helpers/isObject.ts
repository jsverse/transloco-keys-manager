export function isObject(value: any) {
  return value && typeof value === 'object' && !Array.isArray(value);
}
