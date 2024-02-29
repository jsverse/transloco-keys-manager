export function marker<T extends string | string[]>(key: T): T {
  return key;
}

export function markerDefault<T extends string | string[]>(key: T, defaultValue?: string): T {
  return key;
}