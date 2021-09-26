import { Scopes } from '../../types';

export function resolveAliasAndKey(
  key: string,
  scopes: Scopes
): [string, string] {
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

/**
 *
 * Resolve the scope alias
 *
 * @example
 *
 *  scopePath: 'some/nested' => someNested
 *  scopePath: 'some/nested/en' => someNested
 *
 */
export function resolveScopeAlias({
  scopePath,
  scopes,
}: {
  scopePath: string;
  scopes: Scopes;
}) {
  const scopeAlias = scopes.scopeToAlias[scopePath];
  if (scopeAlias) {
    return scopeAlias;
  }

  // Otherwise we're probably have a language in the scope: some/nested/en
  const splitted = scopePath.split('/');

  // Remove the lang
  splitted.pop();

  const scopePathWithoutLang = splitted.join('/');
  return scopePathWithoutLang && scopes.scopeToAlias[scopePathWithoutLang];
}
