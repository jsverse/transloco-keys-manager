import { Diff } from 'deep-diff';

import { buildPath } from '../utils/path.utils';
import { isObject } from '../utils/validators.utils';

export function mapDiffToKeys(
  diffArr: Diff<any>[],
  side: 'lhs' | 'rhs'
): string {
  const keys = diffArr.reduce((acc, diff) => {
    const base = diff.path.join('.');
    const keys = !isObject(diff[side])
      ? [`'${base}'`]
      : buildPath(diff[side]).map((inner) => `'${base}.${inner}'`);

    return acc.concat(keys);
  }, []);

  return keys.join('\n');
}
