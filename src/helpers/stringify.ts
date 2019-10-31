export function stringify(val: object) {
  const sorted = Object.keys(val)
    .sort()
    .reduce((acc, key) => {
      acc[key] = val[key];
      return acc;
    }, {});
  return JSON.stringify(sorted, null, 2);
}
