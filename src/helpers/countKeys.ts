import { isObject } from './isObject';

export function countKeys(obj: object) {
  return Object.keys(obj).reduce((acc, curr) => (isObject(obj[curr]) ? acc + countKeys(obj[curr]) : ++acc), 0);
}
