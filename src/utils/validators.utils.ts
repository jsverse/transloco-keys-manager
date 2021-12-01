import { existsSync, lstatSync } from 'fs';

export function isObject(value: any) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

export function isString(value: any) {
  return value && typeof value === 'string' && !Array.isArray(value);
}

export function isNil(value: unknown): value is undefined | null {
  return typeof value === 'undefined' || value === null;
}

export function isDirectory(path): boolean {
  return existsSync(path) && lstatSync(path).isDirectory();
}
