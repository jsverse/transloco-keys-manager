import { regexs } from '../regexs';
import { addKey } from './addKey';
import { resolveAliasAndKey } from './resolveAliasAndKey';
import { getConfig } from '../config';

const stringToKeys = valueRegex => {
  return v =>
    // Remove the wrapper, t(some.key) => some.key
    v
      .replace(valueRegex, '$1')
      // Support multi keys t(a, b.c, d)
      .split(',')
      // Remove spaces
      .map(v => v.replace(/\*|\n/g, '').trim());
};

const toOneDimArray = (acc, strings) => {
  acc.push(...strings);
  return acc;
};

export function extractCommentsValues({ content, regex, defaultValue, scopes, scopeToKeys }) {
  const marker = getConfig().marker;
  let commentsSection = regex.exec(content);
  while (commentsSection) {
    const valueRegex = regexs.markerValues(marker);
    // Get the rawKeys from the dynamic section
    const markers = commentsSection[0].match(valueRegex);
    if (markers) {
      markers
        .map(stringToKeys(valueRegex))
        .reduce(toOneDimArray, [])
        .forEach(translationKey => {
          const [key, scopeAlias] = resolveAliasAndKey(translationKey, scopes);
          addKey({
            defaultValue,
            scopes,
            scopeToKeys,
            keyWithoutScope: key,
            scopeAlias
          });
        });
    }
    commentsSection = regex.exec(content);
  }
}
