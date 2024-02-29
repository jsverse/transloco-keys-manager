export function marker<T extends string | string[]>(key: T, defaultValue?: string): T {
  return key;
}