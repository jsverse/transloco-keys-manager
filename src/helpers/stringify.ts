import { getConfig } from '../config';

export function stringify(val: object) {
  const { sort } = getConfig();
  let value = val;

  if (sort) {
    value = Object.keys(val)
      .sort()
      .reduce((acc, key) => {
        acc[key] = val[key];
        return acc;
      }, {});
  }

  return JSON.stringify(value, null, 2);
}
