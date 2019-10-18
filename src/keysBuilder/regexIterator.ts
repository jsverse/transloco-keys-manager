import { handleScope } from './handleScope';
import { insertValueToKeys } from './insertValueToKeys';
import { ScopeMap, Scopes } from '../types';

type Params = {
  rgx: RegExp;
  str: string;
  scopeToKeys: ScopeMap;
  scopes: Scopes;
  defaultValue: string;
};

export function regexIterator({ rgx, scopeToKeys, str, scopes, defaultValue }: Params): ScopeMap {
  let result = rgx.exec(str);

  while(result) {
    /** Support ternary operator */
    const { backtickKey, backtickScope, scope } = result.groups;
    const keys = result.groups.key2
      ? [result.groups.key, result.groups.key2]
      : (result.groups.key || backtickKey).replace(/'|"|\s/g, '').split(':');

    for(const currentKey of keys) {
      /**
       *
       * When the string comes from templates the `scopeAlias` is the first item:
       *
       * @example
       *
       * someNested.title => someNested
       *
       * And `actualKey` is: `title`
       *
       * When the string comes from the service the `scopeAlias` is extracted in the upcoming `if` condition:
       *
       * @example
       *
       * translate('fromService', {}, 'some/nested')
       *
       * scopeAlias => some/nested
       *
       * And `actualKey` is fromService
       *
       */
      let [scopeAlias, ...actualKey] = currentKey.split('.');
      console.log('\n------------------\n');

      console.log('scopeAlias', scopeAlias);
      console.log('actualKey', actualKey);

      console.log('\n------------------\n');

      /**
       * When we use a translation in the service this will be the scope path
       *
       * @example
       *
       * translate('fromService', {}, 'some/nested');
       *
       * scopePath: some/nested
       */
      const scopePath = scope || backtickScope;
      console.log('\n------------------\n');
      console.log('scopePath', scopePath);
      console.log('\n------------------\n');
      if(scopePath) {
        [scopeAlias, actualKey] = handleScope({ scopeStr: scopePath, key: scopeAlias, inner: actualKey, scopes });
      }

      console.log('\n------------------\n');

      console.log('scopeAlias', scopeAlias);
      console.log('actualKey', actualKey);

      console.log('\n------------------\n');

      insertValueToKeys({ inner: actualKey, scopes, scopeToKeys, key: scopeAlias, defaultValue });
    }

    result = rgx.exec(str);
  }

  return scopeToKeys;
}
