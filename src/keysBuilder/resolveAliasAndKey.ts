import { Scopes } from '../types';

export function resolveAliasAndKey(key: string, scopes: Scopes): [string, string] {
  /**
   *
   * It can be one of the following:
   *
   * {{ 'title' | transloco }}
   *
   * {{ 'scopeAlias.title' | transloco }}
   *
   */
  const [scopeAliasOrKey, ...actualKey] = key.split('.');
  const scopeAliasExists = scopes.aliasToScope.hasOwnProperty(scopeAliasOrKey);
  const translationKey = scopeAliasExists ? actualKey.join('.') : key;

  return [translationKey, scopeAliasExists ? scopeAliasOrKey : null];
}
