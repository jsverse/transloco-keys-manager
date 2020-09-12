import { getConfig } from '../config';
import { regexs } from '../regexs';
import { BaseParams } from '../types';

import { addKey } from './addKey';
import { resolveAliasAndKey } from './resolveAliasAndKey';

interface ExtractCommentsParams extends BaseParams {
  content: string;
  regex: () => RegExp;
  read?: string;
}

const stringToKeys = valueRegex => {
  return v =>
    // Remove the wrapper, t(some.key) => some.key
    v
      .replace(valueRegex, '$1')
      // Support multi keys t(a, b.c, d)
      .split(',')
      // Remove spaces
      .map(v => v.replace(/\*|\n/g, '').trim())
      // Remove empty keys
      .filter(key => key.length > 0);
};

const toOneDimArray = (acc, strings) => {
  acc.push(...strings);
  return acc;
};

export function extractCommentsValues({
  content,
  regex: regexConstructor,
  read = '',
  ...baseParams
}: ExtractCommentsParams) {
  const marker = getConfig().marker;
  const regex = regexConstructor();
  let commentsSection = regex.exec(content);
  while (commentsSection) {
    const valueRegex = regexs.markerValues(marker);
    // Get the rawKeys from the dynamic section
    const markers = commentsSection[0].match(valueRegex);
    if (markers) {
      markers
        .map(stringToKeys(valueRegex))
        .reduce(toOneDimArray, [])
        .forEach(currentKey => {
          const withRead = read ? `${read}.${currentKey}` : currentKey;

          let [translationKey, scopeAlias] = resolveAliasAndKey(withRead, baseParams.scopes);

          if (!scopeAlias) {
            // It means this is a global key
            translationKey = withRead;
          }

          addKey({
            ...baseParams,
            keyWithoutScope: translationKey,
            scopeAlias
          });
        });
    }
    commentsSection = regex.exec(content);
  }
}
