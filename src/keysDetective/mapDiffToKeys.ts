import { isString } from '../helpers/isString';
import { buildPath } from '../helpers/buildPath';

export function mapDiffToKeys(diffArr: any[], side: string) {
  return diffArr
    .reduce((acc, diff) => {
      const base = diff.path.join('.');
      const keys = isString(diff[side]) ? [`'${base}'`] : buildPath(diff[side]).map(inner => `'${base}.${inner}'`);

      return acc.push(...keys) && acc;
    }, [])
    .join(', ');
}
