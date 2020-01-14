import { getConfig } from '../config';

export function stringify(val: object) {
  const { sort } = getConfig();
  let value = val;

  if (sort) {
    value = sortKeys(val);
  }

  return JSON.stringify(value, null, 2);
}

function sortKeys(val: object) {
  return Object.keys(val)
    .sort()
    .reduce((acc, key) => {
      if (typeof val[key] === 'object') {
        acc[key] = sortKeys(val[key]);
      } else {
        acc[key] = val[key];
      }
      return acc;
    }, {});
}
