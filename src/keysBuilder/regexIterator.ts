import { handleScope } from './handleScope';
import { insertValueToKeys } from './insertValueToKeys';

/**
 * Iterates over a given regex until there a no results and adds all the keys found to the map.
 */
export function regexIterator({ rgx, scopeToKeys, str, scopes, defaultValue }) {
  let result = rgx.exec(str);

  while(result) {
    /** Support ternary operator */
    const { backtickKey, backtickScope, scope } = result.groups;
    const regexKeys = result.groups.key2 ? [result.groups.key, result.groups.key2] : (result.groups.key || backtickKey).replace(/'|"|\s/g, '').split(':');
    for(const regexKey of regexKeys) {
      let [key, ...inner] = regexKey.split('.');
      const scopeStr = scope || backtickScope;

      if(scopeStr) {
        [key, inner] = handleScope({ scopeStr, key, inner, scopes });
      }

      insertValueToKeys({ inner, scopes, scopeToKeys, key, defaultValue });
    }

    result = rgx.exec(str);
  }

  return scopeToKeys;
}
