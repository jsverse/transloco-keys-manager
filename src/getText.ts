export function getText<T extends string | string[]>(key: T): T {
  return key;
}
