import { isObject } from './isObject';

export function buildPath(obj: object) {
  return Object.keys(obj).reduce((acc, curr) => {
    const keys = isObject(obj[curr]) ? buildPath(obj[curr]).map(inner => `${curr}.${inner}`) : [curr];

    return acc.push(...keys) && acc;
  }, []);
}
