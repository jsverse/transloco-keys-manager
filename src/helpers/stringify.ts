import { getConfig } from '../config';

import { isObject } from './isObject';

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
      acc[key] = isObject(val[key]) ? sortKeys(val[key]) : val[key];
      return acc;
    }, {});
}
