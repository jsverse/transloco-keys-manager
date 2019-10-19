import { Scopes } from '../types';

type Params = {
  scopePath: string;
  scopes: Scopes;
};

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
export function resolveScopeAlias({ scopePath, scopes }: Params) {
  const scopeAlias = scopes.scopeToAlias[scopePath];
  if(scopeAlias) {
    return scopeAlias;
  }

  // Otherwise we're probably have a language in the scope: some/nested/en
  const splitted = scopePath.split('/');

  // Remove the lang
  splitted.pop();

  const scopePathWithoutLang = splitted.join('/');
  return scopePathWithoutLang && scopes.scopeToAlias[scopePathWithoutLang];
}
