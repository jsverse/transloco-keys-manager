import { resolveScopeAlias } from './resolveScopeAlias';
import { ScopeMap, Scopes } from '../types';
import { messages } from '../messages';

type Params = {
  rgx: RegExp;
  str: string;
  scopeToKeys: ScopeMap;
  scopes: Scopes;
  defaultValue: string;
};

function resolveAliasAndKeyFromService(key: string, scopePath: string, scopes: Scopes): [string, string] {
  const scopeAlias = resolveScopeAlias({ scopePath, scopes });
  return [key, scopeAlias];
}

function resolveAliasAndKeyFromTemplate(key: string, scopes: Scopes): [string, string] {
  const [scopeAliasOrKey, ...actualKey] = key.split('.');
  const scopeAliasExists = scopes.aliasToScope.hasOwnProperty(scopeAliasOrKey);
  const fullKey = scopeAliasExists ? actualKey.join('.') : scopeAliasOrKey;

  return [fullKey, scopeAliasExists ? scopeAliasOrKey : null];
}

export function regexIterator({ rgx, scopeToKeys, str, scopes, defaultValue }: Params): ScopeMap {
  let result = rgx.exec(str);

  while(result) {
    /** Support ternary operator */
    const { backtickKey, backtickScope, scope } = result.groups;
    const keys = result.groups.key2
      ? [result.groups.key, result.groups.key2]
      : (result.groups.key || backtickKey).replace(/'|"|\s/g, '').split(':');

    /**
     *
     * When this is a template `currentKey` is the full key from the template include scope: `someScope.title`
     * When this is a service `currentKey` is only the key because `scope` is the third function parameter: `title`
     *
     */
    for(const currentKey of keys) {
      const scopePath = scope || backtickScope;
      let keyWithoutScope: string;
      let scopeAlias: null | string;

      /**
       * When we use a translation in the service we'll get a `scopePath`
       *
       * @example
       *
       * translate('fromService', {}, 'some/nested');
       *
       * scopePath: some/nested
       */
      if(scopePath) {
        [keyWithoutScope, scopeAlias] = resolveAliasAndKeyFromService(currentKey, scopePath, scopes);
      } else {
        [keyWithoutScope, scopeAlias] = resolveAliasAndKeyFromTemplate(currentKey, scopes);
      }

      addKey({ defaultValue, keyWithoutScope, scopeAlias, scopes, scopeToKeys });
    }

    result = rgx.exec(str);
  }

  return scopeToKeys;
}

type AddKeysParams = {
  defaultValue: string;
  scopeToKeys: ScopeMap;
  scopeAlias: string;
  keyWithoutScope: string;
  scopes: Scopes;
};

function addKey({ defaultValue, scopeToKeys, scopeAlias, keyWithoutScope, scopes }: AddKeysParams) {
  const scopePath = scopes.aliasToScope[scopeAlias];
  const keyWithScope = scopeAlias ? `${scopeAlias}.${keyWithoutScope}` : keyWithoutScope;
  const keyValue = defaultValue || `${messages.missingValue} '${keyWithScope}'`;

  if(scopePath) {
    if(!scopeToKeys[scopePath]) {
      scopeToKeys[scopePath] = {};
    }
    scopeToKeys[scopePath][keyWithoutScope] = keyValue;
  } else {
    scopeToKeys.__global[keyWithoutScope] = keyValue;
  }
}
